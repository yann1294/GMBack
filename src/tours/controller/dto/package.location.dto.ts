import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for the location part of a Package.
 * Embedded inside Create/Update DTOs for nested validation.
 */
export class PackageLocationDTO {
  // Human-readable location name (e.g. "Bali Beach Resort")
  @IsString()
  @IsNotEmpty()
  public name: string;

  // City where the package is based
  @IsString()
  @IsNotEmpty()
  public city: string;

  // Country of the package location
  @IsString()
  @IsNotEmpty()
  public country: string;
}
