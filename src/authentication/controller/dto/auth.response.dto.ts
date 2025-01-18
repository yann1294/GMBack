import { IsString, IsOptional, IsDateString, IsEmail, IsInt } from "class-validator";
import { AbstractAuthDTO } from "./helper.dto";

// send authentication details as a response

export class AuthResponseDTO extends AbstractAuthDTO {
    @IsEmail()
    email!: string; // Always included in the response.
  
    @IsOptional()
    @IsDateString()
    lastLoginDate?: string;
  
    @IsOptional()
    @IsInt()
    failedLoginAttempts?: number;
  }
  