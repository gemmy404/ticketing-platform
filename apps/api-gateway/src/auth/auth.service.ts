import {HttpException, Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {SERVICES_PORTS} from "@app/common";
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
            this.handleError(err);
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
            this.handleError(err);
        }
    }

    private handleError(error: any) {
        if (error.response) {
            throw new HttpException(error.response.data, error.response.status);
        } else {
            const errorData = {
                message: error.message || 'Service is not available',
                error: error.error || "Service Unavailable",
                statusCode: error.statusCode || 503,
            }
            throw new HttpException(errorData, 503);
        }
    }

}
