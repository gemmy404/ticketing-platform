import {Module, ValidationPipe} from '@nestjs/common';
import {AuthServiceController} from './auth-service.controller';
import {AuthServiceService} from './auth-service.service';
import {KafkaModule} from "@app/kafka";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JWT_CONFIG} from "@app/common";
import {AuthServiceRepository} from "./auth-service.repository";
import {PrismaModule} from "@app/database";
import {JwtStrategy} from "./jwt.strategy";

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.registerAsync({
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow(JWT_CONFIG.ACCESS_TOKEN_SECRET),
                signOptions: {
                    expiresIn: `${configService.getOrThrow(JWT_CONFIG.ACCESS_TOKEN_EXPIRATION)}ms`
                },
            }),
            inject: [ConfigService]
        }),
        KafkaModule.register('auth-service-group'),
    ],
    controllers: [AuthServiceController],
    providers: [
        AuthServiceRepository,
        AuthServiceService,
        JwtStrategy,
        {
            provide: 'APP_PIPE',
            useValue: new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        },
    ],
})
export class AuthServiceModule {
}
