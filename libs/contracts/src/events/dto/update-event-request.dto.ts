import {OmitType, PartialType} from "@nestjs/mapped-types";
import {CreateEventRequestDto} from "./create-event-request.dto";

export class UpdateEventRequestDto extends PartialType(
    OmitType(CreateEventRequestDto, ['status'] as const)
) {
}