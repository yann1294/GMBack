import {
  IsBoolean,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PackageLocationDTO } from './package.location.dto';
import { Type } from 'class-transformer';

export class CreatePackageDTO {
  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;

  @IsString()
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
  public readonly description: string;

  @IsBoolean()
  public readonly isAvailable: boolean;

  @IsString()
  guide: string;

  @ValidateNested()
  @Type(() => PackageLocationDTO)
  location: PackageLocationDTO;
}


// TODO: Add package date