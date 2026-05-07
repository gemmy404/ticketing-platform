import {Module, ValidationPipe} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        HttpModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: 'APP_PIPE',
            useValue: new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        },
    ]
})
export class AuthModule {
}
