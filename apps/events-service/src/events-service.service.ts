import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {KAFKA_SERVICE} from "@app/kafka";
import {ClientKafka} from "@nestjs/microservices";

@Injectable()
export class EventsServiceService implements OnModuleInit {

    constructor(
        @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    ) {
    }

    async onModuleInit() {
        await this.kafkaClient.connect();
    }

}
