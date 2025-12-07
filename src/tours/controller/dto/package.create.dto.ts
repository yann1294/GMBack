import {
  IsBoolean,
  IsNumber,
  IsString,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { PackageLocationDTO } from './package.location.dto';
import { Type } from 'class-transformer';

/**
 * DTO for creating a Package.
 * Used to validate and type incoming POST /packages payloads.
 */
export class CreatePackageDTO {
  // Package display name (required, non-empty string)
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  // Package price (numeric value)
  @IsNumber()
  public readonly price: number;

  // Optional list of image URLs for the package
  @IsString({ each: true })
  @IsOptional()
  public readonly images?: string[];

  // Duration of the package in days (must be >= 0)
  @IsNumber()
  @Min(0)
  public readonly durationDays: number;

  // Discount in percentage (0–100)
  @IsNumber()
  @Min(0)
  @Max(100)
  public readonly discount: number;

  // Total number of seats available in the package
  @IsNumber()
  public readonly numberOfSeats: number;

  // Short description of the package (required)
  @IsString()
  @IsNotEmpty()
  public readonly description: string;

  // Availability flag for the package
  @IsBoolean()
  public readonly isAvailable: boolean;

  // Assigned guide identifier (string, required)
  @IsString()
  @IsNotEmpty()
  guide: string;

  // Nested location object for the package, validated with its own DTO

  @ValidateNested()
  @Type(() => PackageLocationDTO)
  location: PackageLocationDTO;
}

// TODO: Add package date
