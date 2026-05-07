import {Injectable} from '@nestjs/common';
import {PrismaService} from "@app/database";
import {User} from "@prisma/client";

@Injectable()
export class AuthServiceRepository {

    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    async findUserById(id: string) {
        return this.prisma.user.findUnique({
            where: {id},
        });
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {email},
        });
    }

    async createUser(user: User) {
        return this.prisma.user.create({
            data: user,
            omit: {password: true},
        });
    }

}
