import {
  IsArray,
  IsBoolean,
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
  // ─── New profile fields ───────────────────────────
  @IsOptional()
  @IsString()
  firstName?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsString()
  phoneNumber?: string;
  @IsOptional()
  @IsString()
  profilePhoto?: string;
  @IsOptional()
  @IsString()
  identificationFile?: string;
  @IsOptional()
  @IsString()
  identificationType?: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  spokenLanguages?: string[];
  @IsOptional()
  @IsBoolean()
  availability?: boolean;
}
