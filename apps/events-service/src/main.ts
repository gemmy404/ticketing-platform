import {NestFactory} from '@nestjs/core';
import {EventsServiceModule} from './events-service.module';
import {SERVICES_PORTS} from "@app/common";
import {Logger} from "@nestjs/common";

const logger = new Logger('EventsService');

async function bootstrap() {
    const app = await NestFactory.create(EventsServiceModule);
    await app.listen(SERVICES_PORTS.EVENTS_SERVICE);
    logger.log(`Events service is running on port ${SERVICES_PORTS.EVENTS_SERVICE}`);
}

bootstrap();
