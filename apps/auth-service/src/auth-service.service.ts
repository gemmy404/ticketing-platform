import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {KAFKA_SERVICE, KAFKA_TOPICS} from "@app/kafka";
import {ClientKafka} from "@nestjs/microservices";

@Injectable()
export class AuthServiceService implements OnModuleInit {

    constructor(
        @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    ) {
    }

    async onModuleInit() {
        // connecting to kafka when the module is initialized
        await this.kafkaClient.connect();
    }

    simulateUserRegistration(email: string) {
        // publishing a message to the kafka topic
        this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
            email,
            timestamp: new Date().toISOString(),
        });

        return {
            message: `User registered ${email}`,
        };
    }

    getHello(): string {
        return 'Hello World From Auth Service!';
    }

}
