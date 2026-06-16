import {ValidationError} from "class-validator";
import {HttpStatusText} from "@app/common";
import {PaginationDto} from "@app/contracts";

export interface AppResponseDto<T> {
    status: HttpStatusText;
    data: T,
    message?: string,
    validationErrors?: ValidationError[];
    pagination?: PaginationDto;
}