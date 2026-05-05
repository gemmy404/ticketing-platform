import {Body, Controller, Post} from '@nestjs/common';
import {AuthServiceService} from './auth-service.service';
import {LoginRequestDto, RegisterRequestDto} from "@app/contracts";

@Controller('auth')
export class AuthServiceController {
    constructor(private readonly authServiceService: AuthServiceService) {
    }

    @Post('register')
    register(@Body() registerRequest: RegisterRequestDto) {
        return this.authServiceService.register(registerRequest);
    }

    @Post('login')
    login(@Body() loginRequest: LoginRequestDto) {
        return this.authServiceService.login(loginRequest);
    }
}
