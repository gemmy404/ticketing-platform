import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException, Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {Request} from "express";
import {TicketsServiceRepository} from "./tickets-service.repository";

@Injectable()
export class IsTicketOwnerGuard implements CanActivate {

    constructor(private readonly ticketedRepository: TicketsServiceRepository) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const ticketId: string = request.params.ticketId as string;
        const userId: string = request.headers['x-user-id'] as string;

        if (!ticketId) {
            throw new BadRequestException('Ticket ID is required');
        }
        if (!userId) {
            throw new UnauthorizedException('User is not authenticated');
        }

        const savedTicket = await this.ticketedRepository.findTicketById(ticketId);
        if (!savedTicket) {
            throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
        }

        if (savedTicket.userId !== userId) {
            throw new ForbiddenException('You are not authorized to perform this action on this ticket');
        }

        return true;
    }

}