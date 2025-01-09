import { IsString, IsOptional } from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';

export class OAuthSignupDTO extends AbstractAuthDTO {
  @IsString()
  provider!: string;

  @IsString()
  accessToken!: string;

  @IsOptional()
  @IsString()
  userName?: string; // Optional for OAuth signups (inferred from provider data).
}
