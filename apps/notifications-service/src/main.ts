import {NestFactory} from '@nestjs/core';
import {NotificationsServiceModule} from './notifications-service.module';
import {Logger} from "@nestjs/common";
import {SERVICES_PORTS} from "@app/common";

const logger = new Logger('NotificationsService');

async function bootstrap() {
    const app = await NestFactory.create(NotificationsServiceModule);
    await app.listen(SERVICES_PORTS.NOTIFICATIONS_SERVICE);
    logger.log(`Notifications service is running on port ${SERVICES_PORTS.NOTIFICATIONS_SERVICE}`);
}

bootstrap();
