import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PackageDTO } from './package.dto';
import { PackageLocationDTO } from './package.location.dto';
import { Type } from 'class-transformer';

export class UpdatePackageDTO {
  @IsString()
  public id: string;

  @IsOptional()
  @IsString()
  public readonly name?: string;

  @IsNumber()
  @IsOptional()
  public price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  public durationDays?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  public discount?: number;

  @IsNumber()
  @IsOptional()
  public numberOfSeats?: number;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsBoolean()
  @IsOptional()
  public isAvailable?: boolean;

  @ValidateNested()
  @Type(() => PackageLocationDTO)
  @IsOptional()
  location?: PackageLocationDTO;

  @IsOptional()
  @IsArray()
  public readonly tours?: PackageDTO[];
}
