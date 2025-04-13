import { IsString, IsOptional } from 'class-validator';
import { RoleName } from 'src/authentication/types/role.types';
// adjust the path as needed

export class RoleDto {
  @IsString()
  name: RoleName;

  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];

  @IsOptional()
  @IsString()
  description?: string;
}
