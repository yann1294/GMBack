import { IsOptional, IsString } from 'class-validator';

export class PackageLocationDTO {
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public city: string;

  @IsString()
  @IsOptional()
  public country: string;
}
