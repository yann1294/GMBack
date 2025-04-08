import { IsString, MinLength, IsEmail } from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';
import { Ip } from '@nestjs/common';
import { Role } from 'src/authentication/utils/helper';

export class AuthSignupDTO extends AbstractAuthDTO {
  @IsString()
  username: string;

  @IsEmail()
  email!: string; // Required for signup.

  @IsString()
  @MinLength(6)
  password!: string; // Required for signup.

  @IsString()
  role?: Role;
}
