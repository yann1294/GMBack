import {
  IsString,
  MinLength,
  IsEmail,
  ValidateNested,
  IsOptional,
  Validate,
} from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';
import { IRole } from 'src/authentication/types/role.types';
import { Type } from 'class-transformer';
import { RoleDto } from './auth.role.dto';

export class AuthSignupDTO extends AbstractAuthDTO {
  @IsEmail()
  emailAddress!: string; // Required for signup.

  @IsString()
  @MinLength(6)
  password!: string; // Required for signup.
  // if role is optional
  @Type(() => RoleDto)
  @ValidateNested()
  role?: RoleDto;
}
