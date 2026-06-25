import {IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsUUID, Max, MaxLength, Min} from "class-validator";

export class PurchaseTicketRequestDto {
    @IsUUID('4', {message: 'Invalid UUID format'})
    @IsNotEmpty({message: 'Event ID is required'})
    eventId: string;

    @IsInt({message: 'Quantity must be an integer'})
    @Min(1, {message: 'Quantity must be at least 1'})
    @Max(10, {message: 'Quantity must at most 10'})
    quantity: number;
}