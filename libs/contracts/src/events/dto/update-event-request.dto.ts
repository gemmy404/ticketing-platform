import {PartialType} from "@nestjs/mapped-types";
import {CreateEventRequestDto} from "@app/contracts/events";

export class UpdateEventRequestDto extends PartialType(CreateEventRequestDto) {
}