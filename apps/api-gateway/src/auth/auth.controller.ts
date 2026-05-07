import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginRequestDto, RegisterRequestDto} from "@app/contracts";

@Controller('api/v1/auth')
export class AuthController {


    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    register(@Body() registerRequest: RegisterRequestDto) {
        return this.authService.register(registerRequest);
    }

    @Post('login')
    login(@Body() loginRequest: LoginRequestDto) {
        return this.authService.login(loginRequest);
    }

}
