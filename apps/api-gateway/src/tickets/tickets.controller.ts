import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {TicketsService} from './tickets.service';
import {CheckedInTicketRequestDto, CurrentUserDto, PaginationQueryDto, PurchaseTicketRequestDto} from "@app/contracts";
import {CurrentUser} from "@app/common";
import {JwtAuthGuard} from "../../../auth-service/src/jwt-auth.guard";

@Controller('api/v1/tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {
    }

    @Post('purchase-ticket')
    purchaseTicket(
        @Body() purchaseTicketRequest: PurchaseTicketRequestDto,
        @CurrentUser() currentUser: CurrentUserDto
    ) {
        return this.ticketsService.purchaseTicket(purchaseTicketRequest, currentUser);
    }

    @Get('me')
    findMyTickets(
        @Query() paginationQuery: PaginationQueryDto,
        @CurrentUser() currentUser: CurrentUserDto
    ) {
        return this.ticketsService.findMyTickets(paginationQuery, currentUser);
    }

    @Get('events/:eventId')
    findEventTickets(
        @Param('eventId') eventId: string,
        @CurrentUser() currentUser: CurrentUserDto,
        @Query() paginationQuery: PaginationQueryDto
    ) {
        return this.ticketsService.findEventTickets(eventId, currentUser, paginationQuery);
    }

    @Get(':ticketId')
    findTicketById(
        @Param('ticketId') ticketId: string,
        @CurrentUser() currentUser: CurrentUserDto
    ) {
        return this.ticketsService.findTicketById(ticketId, currentUser);
    }

    @Patch(':ticketId/cancel-ticket')
    cancelTicket(
        @Param('ticketId') ticketId: string,
        @CurrentUser() currentUser: CurrentUserDto
    ) {
        return this.ticketsService.cancelTicket(ticketId, currentUser);
    }

    @Patch('check-in-ticket')
    checkInTicket(
        @Body() checkedInTicketRequest: CheckedInTicketRequestDto,
        @CurrentUser() currentUser: CurrentUserDto
    ) {
        return this.ticketsService.checkInTicket(checkedInTicketRequest, currentUser);
    }

}
