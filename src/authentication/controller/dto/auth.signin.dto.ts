import { IsString, MinLength, IsEmail } from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';

export class AuthSigninDTO extends AbstractAuthDTO {
  @IsEmail()
  email!: string; // Required for signin.

  @IsString()
  @MinLength(6)
  password!: string; // Required for signin.
}
