import {Injectable} from '@nestjs/common';
import {handleServiceError, SERVICES_PORTS} from "@app/common";
import {HttpService} from "@nestjs/axios";
import {CheckedInTicketRequestDto, CurrentUserDto, PaginationQueryDto, PurchaseTicketRequestDto} from "@app/contracts";
import {firstValueFrom} from "rxjs";

@Injectable()
export class TicketsService {

    private readonly TICKETS_SERVICE_URL: string =
        `http://localhost:${SERVICES_PORTS.TICKETS_SERVICE}/tickets`;

    constructor(
        private readonly httpService: HttpService,
    ) {
    }

    async purchaseTicket(purchaseTicketRequest: PurchaseTicketRequestDto, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.post(
                `${this.TICKETS_SERVICE_URL}/purchase-ticket`,
                purchaseTicketRequest,
                {
                    headers: {
                        'x-user-id': currentUser.id
                    },
                }
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

    async findMyTickets(paginationQuery: PaginationQueryDto, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.get(
                `${this.TICKETS_SERVICE_URL}/me`,
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

    async findEventTickets(eventId: string, currentUser: CurrentUserDto, paginationQuery: PaginationQueryDto) {
        try {
            const response = await firstValueFrom(this.httpService.get(
                `${this.TICKETS_SERVICE_URL}/events/${eventId}`,
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

    async findTicketById(ticketId: string, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.get(
                `${this.TICKETS_SERVICE_URL}/${ticketId}`,
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

    async cancelTicket(ticketId: string, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.patch(
                `${this.TICKETS_SERVICE_URL}/${ticketId}/cancel-ticket`,
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

    async checkInTicket(checkedInTicketRequest: CheckedInTicketRequestDto, currentUser: CurrentUserDto) {
        try {
            const response = await firstValueFrom(this.httpService.patch(
                `${this.TICKETS_SERVICE_URL}/check-in-ticket`,
                checkedInTicketRequest,
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
