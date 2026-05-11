import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express";
import {CurrentUserDto} from "@app/common/dto";
import {UserRole} from "@prisma/client";

@Injectable()
export class IsAdminGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const currentUser: CurrentUserDto = request.user as CurrentUserDto;

        if (currentUser.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        return true;
    }

}