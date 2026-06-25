import {NestFactory} from '@nestjs/core';
import {TicketsServiceModule} from './tickets-service.module';
import {Logger} from "@nestjs/common";
import {SERVICES_PORTS} from "@app/common";

const logger = new Logger('TicketsService');

async function bootstrap() {
    const app = await NestFactory.create(TicketsServiceModule);
    await app.listen(SERVICES_PORTS.TICKETS_SERVICE);
    logger.log(`Tickets service is running on port ${SERVICES_PORTS.TICKETS_SERVICE}`);
}

bootstrap();
