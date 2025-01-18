import { IsString } from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';

export class OAuthSigninDTO extends AbstractAuthDTO {
  @IsString()
  provider!: string; // e.g., 'google', 'facebook'.

  @IsString()
  accessToken!: string; // OAuth token from the provider.
}
