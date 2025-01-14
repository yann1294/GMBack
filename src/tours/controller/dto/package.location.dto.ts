import { IsString, IsNotEmpty } from 'class-validator';

export class PackageLocationDTO {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public city: string;

  @IsString()
  @IsNotEmpty()
  public country: string;
}
