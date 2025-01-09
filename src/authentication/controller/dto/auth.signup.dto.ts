import { IsString, MinLength, IsEmail } from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';

export class AuthSignupDTO extends AbstractAuthDTO {
  @IsEmail()
  email!: string; // Required for signup.

  @IsString()
  @MinLength(6)
  password!: string; // Required for signup.
}
