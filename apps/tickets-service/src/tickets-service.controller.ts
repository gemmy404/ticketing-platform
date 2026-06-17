import {Controller} from '@nestjs/common';
import {TicketsServiceService} from './tickets-service.service';

@Controller('tickets')
export class TicketsServiceController {

    constructor(private readonly ticketsServiceService: TicketsServiceService) {
    }

}
