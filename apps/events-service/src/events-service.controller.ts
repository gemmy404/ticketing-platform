import {Body, Controller, Get, Headers, Param, Patch, Post, Query} from '@nestjs/common';
import {EventsServiceService} from './events-service.service';
import {CreateEventRequestDto, PaginationQueryDto, UpdateEventRequestDto} from "@app/contracts";
import {Event} from "@prisma/client";

@Controller('events')
export class EventsServiceController {
    constructor(private readonly eventsServiceService: EventsServiceService) {
    }

    @Post()
    createEvent(
        @Body() createEventRequest: CreateEventRequestDto,
        @Headers('x-user-id') userId: string,
    ): Promise<Event> {
        return this.eventsServiceService.createEvent(createEventRequest, userId);
    }

    @Get()
    findAllEvents(
        @Query() paginationQuery: PaginationQueryDto
    ) {
        return this.eventsServiceService.findAllEvents(paginationQuery);
    }

    @Get('me')
    findMyEvents(
        @Query() paginationQuery: PaginationQueryDto,
        @Headers('x-user-id') userId: string,
    ) {
        return this.eventsServiceService.findMyEvents(paginationQuery, userId);
    }

    @Get(':eventId')
    findEventById(@Param('eventId') eventId: string) {
        return this.eventsServiceService.findEventById(eventId);
    }

    @Patch(':eventId/publish-event')
    publishEvent(
        @Param('eventId') eventId: string,
        @Headers('x-user-id') userId: string,
    ) {
        return this.eventsServiceService.publishEvent(eventId, userId);
    }

    @Patch(':eventId/cancel-event')
    cancelEvent(
        @Param('eventId') eventId: string,
        @Headers('x-user-id') userId: string,
    ) {
        return this.eventsServiceService.cancelEvent(eventId, userId);
    }

    @Patch(':eventId')
    updateEvent(
        @Param('eventId') eventId: string,
        @Body() updateEventRequest: UpdateEventRequestDto,
        @Headers('x-user-id') userId: string,
    ) {
        return this.eventsServiceService.updateEvent(eventId, updateEventRequest, userId);
    }

}
