import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PackageLocationDTO } from './package.location.dto';

export class PackageDTO {
  @IsString() 
  public readonly name: string;

  @ValidateNested()
  @Type(() => PackageLocationDTO)
  public readonly location: PackageLocationDTO;

  @IsNumber()
  public readonly price: number;

  @IsDateString()
  public readonly date: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  public readonly images: string[];
  
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  public readonly tours: string[];

  @IsNumber()
  @Min(0)
  public readonly durationDays: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  public readonly discount: number;

  @IsNumber()
  @Min(0)
  public readonly numberOfSeats: number;

  @IsString()
  public readonly description: number;

  @IsBoolean()
  public readonly isAvailable: boolean;

  @IsString()
  @IsOptional()
  public readonly guide: string;
}
