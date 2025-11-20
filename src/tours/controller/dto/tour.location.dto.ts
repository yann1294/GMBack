import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for the tour location section.
 * Used in both create and update tour DTOs.
 */
export class TourLocationDTO {
  // Location name (e.g. "Paris City Center")
  @IsString()
  @IsNotEmpty()
  public name: string;

  // City where the tour takes place
  @IsString()
  @IsNotEmpty()
  public city: string;

  // Country of the tour
  @IsString()
  @IsNotEmpty()
  public country: string;
}
