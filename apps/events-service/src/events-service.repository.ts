import {Injectable} from '@nestjs/common';
import {PrismaService} from "@app/database";
import {Event} from "@prisma/client";

@Injectable()
export class EventsServiceRepository {

    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    async createEvent(event: Event) {
        return this.prisma.event.create({
            data: event,
        });
    }

    async findEventById(id: string) {
        return this.prisma.event.findUnique({
            where: {id},
        });
    }

    async findAllEvents(query: {}, take: number, skip: number) {
        const [events, totalElements] = await Promise.all([
            this.prisma.event.findMany({
                where: query,
                take,
                skip,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    organizer: {
                        select: {name: true}
                    }
                }
            }),
            this.prisma.event.count({where: query}),
        ]);

        return {events, totalElements};
    }

    async updateEvent(id: string, event: Event) {
        return this.prisma.event.update({
            where: {id},
            data: event,
        });
    }

}
