import {NestFactory} from '@nestjs/core';
import {AuthServiceModule} from './auth-service.module';
import {SERVICES_PORTS} from "@app/common";
import {Logger} from "@nestjs/common";

const logger = new Logger('AuthService');

async function bootstrap() {
    const app = await NestFactory.create(AuthServiceModule);
    await app.listen(SERVICES_PORTS.AUTH_SERVICE);
    logger.log(`Auth service is running on port ${SERVICES_PORTS.AUTH_SERVICE}`)
}

bootstrap();
