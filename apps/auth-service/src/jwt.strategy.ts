import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {AuthServiceRepository} from "./auth-service.repository";
import {JWT_CONFIG} from "@app/common";
import {CurrentUserDto} from "@app/contracts";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService,
        private readonly authRepository: AuthServiceRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow(JWT_CONFIG.ACCESS_TOKEN_SECRET),
        });
    }

    async validate(payload: CurrentUserDto): Promise<CurrentUserDto> {
        const user = await this.authRepository.findUserById(payload.id);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return payload;
    }
}