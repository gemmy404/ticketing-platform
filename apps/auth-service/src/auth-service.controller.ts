import {Body, Controller, Get, Post} from '@nestjs/common';
import {AuthServiceService} from './auth-service.service';

@Controller('api/v1/auth')
export class AuthServiceController {
    constructor(private readonly authServiceService: AuthServiceService) {
    }

    @Post('register')
    simulateUserRegistration(@Body() body: { email: string }) {
        return this.authServiceService.simulateUserRegistration(body.email);
    }


    @Get()
    getHello(): string {
        return this.authServiceService.getHello();
    }
}
