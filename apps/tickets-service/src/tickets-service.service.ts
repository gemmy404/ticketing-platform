import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    OnModuleInit
} from '@nestjs/common';
import {KAFKA_SERVICE, KAFKA_TOPICS} from "@app/kafka";
import {ClientKafka} from "@nestjs/microservices";
import {TicketsServiceRepository} from "./tickets-service.repository";
import {
    CheckedInTicketRequestDto,
    PaginationQueryDto,
    PurchaseTicketRequestDto,
    TicketCancelledEvent,
    TicketPurchasedEvent
} from "@app/contracts";
import {EventsServiceRepository} from "../../events-service/src/events-service.repository";
import {EventStatus, Ticket, TicketStatus} from "@prisma/client";
import {generateCodes} from "@app/common";

@Injectable()
export class TicketsServiceService implements OnModuleInit {

    constructor(
        @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
        private readonly ticketsRepository: TicketsServiceRepository,
        private readonly eventsRepository: EventsServiceRepository,
    ) {
    }

    async onModuleInit() {
        await this.kafkaClient.connect();
    }

    async purchaseTicket(purchaseTicketRequest: PurchaseTicketRequestDto, userId: string) {
        const {eventId, quantity} = purchaseTicketRequest;

        const savedEvent = await this.eventsRepository.findEventById(eventId);
        if (!savedEvent) {
            throw new NotFoundException(`Event with id ${eventId} not found`);
        }

        if (savedEvent.status !== EventStatus.PUBLISHED) {
            throw new BadRequestException('Event is not published yet');
        }

        if ((savedEvent.date.getTime() + (60 * 60 * 1000)) < new Date().getTime()) {
            throw new BadRequestException('No longer available to purchase tickets for this event as it has passed');
        }

        const soldTickets: number = await this.ticketsRepository.countSoldTickets(eventId);
        const remainingTickets: number = savedEvent.capacity - soldTickets;

        if (quantity > remainingTickets) {
            throw new BadRequestException(`Only ${remainingTickets} tickets are available for this event`);
        }

        const ticket = {
            eventId,
            userId,
            quantity,
            totalPrice: savedEvent.price * quantity,
            ticketCode: generateCodes(),
            status: TicketStatus.CONFIRMED,
        } as Ticket;

        const createdTicket = await this.ticketsRepository.createTicket(ticket);

        const ticketPurchasedEvent: TicketPurchasedEvent = {
            ticketId: createdTicket.id,
            ticketCode: createdTicket.ticketCode,
            email: createdTicket.user.email,
            name: createdTicket.user.name,
            eventTitle: savedEvent.title,
            eventDate: savedEvent.date,
            eventLocation: savedEvent.location,
            quantity: createdTicket.quantity,
            totalPrice: createdTicket.totalPrice,
        };
        this.kafkaClient.emit(KAFKA_TOPICS.TICKET_PURCHASED, ticketPurchasedEvent);

        return {
            message: 'Ticket purchased successfully',
            data: {
                id: createdTicket.id,
                ticketCode: createdTicket.ticketCode,
                eventTitle: savedEvent.title,
                quantity: createdTicket.quantity,
                totalPrice: createdTicket.totalPrice,
                status: createdTicket.status,
                purchasedAt: createdTicket.purchasedAt,
            },
        };
    }

    async findMyTickets(paginationQuery: PaginationQueryDto, userId: string) {
        const {size, page} = paginationQuery;
        const skip: number = (page - 1) * size;

        const {tickets, totalElements} = await this.ticketsRepository
            .findAllTickets({userId}, size, skip);

        return {
            tickets,
            totalElements,
        };
    }

    async findEventTickets(eventId: string, organizerId: string, paginationQuery: PaginationQueryDto) {
        const {size, page} = paginationQuery;
        const skip: number = (page - 1) * size;

        const savedEvent = await this.eventsRepository.findEventById(eventId);
        if (!savedEvent) {
            throw new NotFoundException(`Event with id ${eventId} not found`);
        }

        if (savedEvent.organizerId !== organizerId) {
            throw new ForbiddenException('You are not authorized to view this event\'s tickets');
        }

        const {tickets, totalElements} = await this.ticketsRepository
            .findAllTickets({eventId}, size, skip);

        return {
            tickets,
            totalElements,
        };
    }

    async findTicketById(ticketId: string) {
        const savedTicket = (await this.ticketsRepository.findTicketById(ticketId))!;

        return savedTicket;
    }

    async cancelTicket(ticketId: string) {
        const savedTicket = (await this.ticketsRepository.findTicketById(ticketId))!;

        if (savedTicket.status === TicketStatus.CANCELLED || savedTicket.status === TicketStatus.CHECKED_IN) {
            throw new BadRequestException(`Ticket is already ${savedTicket.status.toLowerCase()}`);
        }

        const cancelledTicket = await this.ticketsRepository
            .updateTicket(ticketId, {status: TicketStatus.CANCELLED} as Ticket);

        const ticketCancelledEvent: TicketCancelledEvent = {
            ticketId: cancelledTicket.id,
            email: cancelledTicket.user.email,
            name: cancelledTicket.user.name,
            eventTitle: cancelledTicket.event.title,
        };
        this.kafkaClient.emit(KAFKA_TOPICS.TICKET_CANCELLED, ticketCancelledEvent);

        return {
            message: 'Ticket cancelled successfully',
            data: cancelledTicket,
        };
    }

    async checkInTicket(checkedInTicketRequest: CheckedInTicketRequestDto, organizerId: string) {
        const {ticketCode} = checkedInTicketRequest;

        const savedTicket = await this.ticketsRepository.findTicketByCode(ticketCode);
        if (!savedTicket) {
            throw new NotFoundException(`Ticket with code ${ticketCode} not found`);
        }

        if (savedTicket.event.organizerId !== organizerId) {
            throw new ForbiddenException('You are not authorized to check in this ticket');
        }

        if (savedTicket.status === TicketStatus.CANCELLED || savedTicket.status === TicketStatus.CHECKED_IN) {
            throw new BadRequestException(`Ticket is already ${savedTicket.status.toLowerCase()}`);
        }

        const checkedInTicket = await this.ticketsRepository
            .updateTicket(savedTicket.id, {
                status: TicketStatus.CHECKED_IN,
                checkedInAt: new Date(),
            } as Ticket);

        this.kafkaClient.emit(KAFKA_TOPICS.TICKET_CHECKED_IN, {
            ticketId: checkedInTicket.id,
            eventId: checkedInTicket.eventId,
            ticketCode: ticketCode,
            timestamp: new Date().toISOString(),
        });

        return {
            message: 'Ticket checked in successfully',
            data: checkedInTicket,
        };
    }
}
