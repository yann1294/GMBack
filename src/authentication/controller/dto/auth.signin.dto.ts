import { IsString, MinLength, IsEmail, IsNotEmpty } from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';

export class AuthSigninDTO extends AbstractAuthDTO {
  @IsEmail()
  @IsNotEmpty()
  emailAddress!: string; // Required for signin.

  @IsString()
  @MinLength(6)
  password!: string; // Required for signin.
}
