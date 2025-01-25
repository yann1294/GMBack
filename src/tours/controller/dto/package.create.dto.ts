import {
  IsBoolean,
  IsNumber,
  IsString, IsNotEmpty, 
  Max,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { PackageLocationDTO } from './package.location.dto';
import { Type } from 'class-transformer';

export class CreatePackageDTO {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;

  @IsString({ each: true })
  @IsOptional()
  public readonly images?: string[];

  @IsNumber()
  @Min(0)
  public readonly durationDays: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  public readonly discount: number;

  @IsNumber()
  public readonly numberOfSeats: number;

  @IsString()
  @IsNotEmpty()
  public readonly description: string;

  @IsBoolean()
  public readonly isAvailable: boolean;

  @IsString()
  @IsNotEmpty()
  guide: string;

  @ValidateNested()
  @Type(() => PackageLocationDTO)
  location: PackageLocationDTO;
}


// TODO: Add package date