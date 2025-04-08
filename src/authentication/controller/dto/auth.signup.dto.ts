import { IsString, MinLength, IsEmail, ValidateNested } from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';
import { Ip } from '@nestjs/common';
import { Role } from 'src/authentication/utils/helper';
import { Type } from 'class-transformer';

export class AuthSignupDTO extends AbstractAuthDTO {
  @IsEmail()
  email!: string; // Required for signup.

  @IsString()
  @MinLength(6)
  password!: string; // Required for signup.
}
