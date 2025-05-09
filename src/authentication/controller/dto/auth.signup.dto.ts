import {
  IsString,
  MinLength,
  IsEmail,
  ValidateNested,
  IsOptional,
  Validate,
  IsNotEmpty,
  IsIP,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';
import { IRole } from 'src/authentication/types/role.types';
import { Type } from 'class-transformer';
import { RoleDto } from './auth.role.dto';
import { Ip } from '@nestjs/common';

export class AuthSignupDTO extends AbstractAuthDTO {
  @IsEmail()
  @IsNotEmpty()
  emailAddress!: string; // Required for signup.

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string; // Required for signup.
  // if role is optional
  @Type(() => RoleDto)
  @ValidateNested()
  role?: RoleDto;

  // New profile fields
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  profilePhoto?: string; // could be a URL

  @IsString()
  @IsOptional()
  identificationFile?: string; // could be a URL / storage path

  @IsString()
  @IsOptional()
  identificationType?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  spokenLanguages?: string[];

  @IsBoolean()
  @IsOptional()
  availability?: boolean; // guide-only
}
