// role-param.dto.ts
import { IsString, IsIn } from 'class-validator';

export class RoleParamDto {
  @IsString()
  @IsIn(['admin', 'tourist', 'guide'], {
    message: 'Role must be one of: admin, tourist, guide',
  })
  name: string;
}
