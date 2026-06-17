import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {EventsService} from './events.service';
import {CreateEventRequestDto, CurrentUserDto, PaginationQueryDto, UpdateEventRequestDto} from "@app/contracts";
import {CurrentUser} from "@app/common";
import {Event} from "@prisma/client";
import {JwtAuthGuard} from "../../../auth-service/src/jwt-auth.guard";

@Controller('api/v1/events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    createEvent(
        @Body() createEventRequest: CreateEventRequestDto,
        @CurrentUser() currentUser: CurrentUserDto
    ): Promise<Event> {
        return this.eventsService.createEvent(createEventRequest, currentUser);
    }

    @Get()
    findAllEvents(
        @Query() paginationQuery: PaginationQueryDto
    ) {
        return this.eventsService.findAllEvents(paginationQuery);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    findMyEvents(
        @Query() paginationQuery: PaginationQueryDto,
        @CurrentUser() currentUser: CurrentUserDto
    ) {
        return this.eventsService.findMyEvents(paginationQuery, currentUser);
    }

    @Get(':eventId')
    findEventById(@Param('eventId') eventId: string) {
        return this.eventsService.findEventById(eventId);
    }

    @Patch(':eventId/publish-event')
    @UseGuards(JwtAuthGuard)
    publishEvent(
        @Param('eventId') eventId: string,
        @CurrentUser() currentUser: CurrentUserDto
    ) {
        return this.eventsService.publishEvent(eventId, currentUser);
    }

    @Patch(':eventId/cancel-event')
    @UseGuards(JwtAuthGuard)
    cancelEvent(
        @Param('eventId') eventId: string,
        @CurrentUser() currentUser: CurrentUserDto
    ) {
        return this.eventsService.cancelEvent(eventId, currentUser);
    }

    @Patch(':eventId')
    @UseGuards(JwtAuthGuard)
    updateEvent(
        @Param('eventId') eventId: string,
        @Body() updateEventRequest: UpdateEventRequestDto,
        @CurrentUser() currentUser: CurrentUserDto
    ) {
        return this.eventsService.updateEvent(eventId, updateEventRequest, currentUser);
    }

}
