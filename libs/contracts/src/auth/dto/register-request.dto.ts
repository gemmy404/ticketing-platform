import {IsEmail, IsNotEmpty, IsStrongPassword, MaxLength} from "class-validator";

export class RegisterRequestDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Invalid email format'})
    @MaxLength(30, {message: 'Email must not exceed 30 characters'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @MaxLength(20, {message: 'Password must not exceed 20 characters'})
    @IsStrongPassword({}, {
        message: 'Password is too weak. It must be contain uppercase, lowercase, numbers, and special characters'
    })
    password: string;

    @IsNotEmpty({message: 'Name is required'})
    @MaxLength(50, {message: 'Name must not exceed 50 characters'})
    name: string;
}