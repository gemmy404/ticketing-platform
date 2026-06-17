import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {KAFKA_SERVICE} from "@app/kafka";
import {ClientKafka} from "@nestjs/microservices";
import {TicketsServiceRepository} from "./tickets-service.repository";

@Injectable()
export class TicketsServiceService implements OnModuleInit {

    constructor(
        @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
        private readonly ticketsRepository: TicketsServiceRepository,
    ) {
    }

    async onModuleInit() {
        await this.kafkaClient.connect();
    }

}
