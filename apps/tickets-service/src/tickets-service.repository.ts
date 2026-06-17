import {Injectable} from '@nestjs/common';
import {PrismaService} from "@app/database";

@Injectable()
export class TicketsServiceRepository {

    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

}
