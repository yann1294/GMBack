import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreatePackageDTO {
  @IsString()
  public readonly id: string;

  @IsString()
  public readonly name: string;
}

export class UpdatePackageDTO {
  @IsOptional()
  @IsString()
  public readonly name?: string;

  @IsOptional()
  @IsArray()
  public readonly tours?: string[];
}
