import {IsNotEmpty, IsString} from "class-validator";

export class CheckedInTicketRequestDto {
    @IsString({message: 'Ticket code must be a string'})
    @IsNotEmpty({message: 'Ticket code is required'})
    ticketCode: string;
}