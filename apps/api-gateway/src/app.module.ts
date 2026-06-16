import {Module, ValidationPipe} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./auth/auth.module";
import {EventsModule} from "./events/events.module";
import {APP_PIPE} from "@nestjs/core";
import {AuthServiceModule} from "../../auth-service/src/auth-service.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        AuthServiceModule,
        EventsModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        },
    ],
})
export class AppModule {
}
