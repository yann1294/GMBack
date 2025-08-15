import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePackageToursDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @IsString({ each: true })
  tours!: string[];
}
