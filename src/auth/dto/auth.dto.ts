import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../entities/user.entity';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}

export class VerifyDto {
    @IsEmail()
    email: string;

    @IsString()
    otp: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}