import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {handleServiceError, SERVICES_PORTS} from "@app/common";
import {LoginRequestDto, RegisterRequestDto} from "@app/contracts";
import {lastValueFrom} from "rxjs";

@Injectable()
export class AuthService {

    private readonly AUTH_SERVICE_URL: string =
        `http://localhost:${SERVICES_PORTS.AUTH_SERVICE}/auth`;

    constructor(
        private readonly httpService: HttpService,
    ) {
    }

    async register(registerRequest: RegisterRequestDto) {
        try {
            const response = await lastValueFrom(this.httpService.post(
                `${this.AUTH_SERVICE_URL}/register`,
                registerRequest,
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

    async login(loginRequest: LoginRequestDto) {
        try {
            const response = await lastValueFrom(this.httpService.post(
                `${this.AUTH_SERVICE_URL}/login`,
                loginRequest,
            ));

            return response.data;
        } catch (err) {
            handleServiceError(err);
        }
    }

}
