import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';
import { Role } from 'src/authentication/utils/helper';
import { IRole } from 'src/authentication/types/role.types';

export class OAuthSignupDTO extends AbstractAuthDTO {
  @IsString()
  provider!: string;

  @IsString()
  accessToken!: string;

  @IsOptional()
  @ValidateNested()
  role?: IRole; // Optional for OAuth signups (inferred from provider data).
}
