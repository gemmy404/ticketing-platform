import {Injectable} from '@nestjs/common';
import {handleServiceError, SERVICES_PORTS} from "@app/common";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import {CreateEventRequestDto, CurrentUserDto, PaginationQueryDto, UpdateEventRequestDto} from "@app/contracts";

@Injectable()
export class EventsService {

    private readonly EVENTS_SERVICE_URL: string =
        `http://localhost:${SERVICES_PORTS.EVENTS_SERVICE}/events`;

    constructor(
        private readonly httpService: HttpService,
    ) {
    }

    async createEvent(createEventRequest: CreateEventRequestDto, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.post(
                `${this.EVENTS_SERVICE_URL}`,
                createEventRequest,
                {
                    headers: {
                        'x-user-id': currentUser.id
                    }
                }
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

    async findAllEvents(paginationQuery: PaginationQueryDto) {
        try {
            const response = await firstValueFrom(this.httpService.get(
                `${this.EVENTS_SERVICE_URL}`,
                {
                    params: paginationQuery,
                }
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

    async findEventById(id: string) {
        try {
            const response = await firstValueFrom(this.httpService.get(
                `${this.EVENTS_SERVICE_URL}/${id}`
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

    async findMyEvents(paginationQuery: PaginationQueryDto, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.get(
                `${this.EVENTS_SERVICE_URL}/me`,
                {
                    params: paginationQuery,
                    headers: {
                        'x-user-id': currentUser.id
                    }
                }
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

    async updateEvent(id: string, updateEventRequest: UpdateEventRequestDto, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.patch(
                `${this.EVENTS_SERVICE_URL}/${id}`,
                updateEventRequest,
                {
                    headers: {
                        'x-user-id': currentUser.id
                    }
                }
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

    async publishEvent(id: string, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.patch(
                `${this.EVENTS_SERVICE_URL}/${id}/publish-event`,
                {},
                {
                    headers: {
                        'x-user-id': currentUser.id
                    }
                }
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

    async cancelEvent(id: string, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.patch(
                `${this.EVENTS_SERVICE_URL}/${id}/cancel-event`,
                {},
                {
                    headers: {
                        'x-user-id': currentUser.id
                    }
                }
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

}
