import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';
import { Type } from 'class-transformer';

/**
 * Used to update authentication details (e.g., password reset or email change).
 * All fields are optional to allow for partial updates.
 */

export class AuthUpdateDTO extends AbstractAuthDTO {
  @IsOptional()
  @IsEmail()
  emailAddress?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  lastLoginDate?: Date;

  @IsOptional()
  @IsInt()
  failedLoginAttempts?: number;
}
