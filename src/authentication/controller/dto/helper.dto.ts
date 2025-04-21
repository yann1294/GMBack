import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';

export abstract class AbstractAuthDTO {
  @IsEmail()
  @IsOptional() // Allow derived DTOs to decide if this is optional or required
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  lastLoginDate?: Date;

  @IsOptional()
  @IsInt()
  failedLoginAttempts?: number;
}
