import {Module, ValidationPipe} from '@nestjs/common';
import {EventsServiceController} from './events-service.controller';
import {EventsServiceService} from './events-service.service';
import {PrismaModule} from "@app/database";
import {KafkaModule} from "@app/kafka";
import {EventsServiceRepository} from "./events-service.repository";

@Module({
    imports: [
        PrismaModule,
        KafkaModule.register('events-service-group'),
    ],
    controllers: [EventsServiceController],
    providers: [
        EventsServiceRepository,
        EventsServiceService,
        {
            provide: 'APP_PIPE',
            useValue: new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        },
    ],
})
export class EventsServiceModule {
}
