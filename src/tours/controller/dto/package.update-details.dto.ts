// package.update-details.dto.ts
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePackageDTO } from './package.create.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating only the "details" of a package (no tours).
 * - Extends CreatePackageDTO but marks fields as optional (PartialType).
 * - Adds required id and optional date.
 */
export class UpdatePackageDetailsDTO extends PartialType(CreatePackageDTO) {
  // Package identifier to update (required)
  @IsString()
  @IsNotEmpty()
  id: string;

  // Optional date for the package, represented as a string (e.g. ISO date)
  @IsOptional()
  @IsString() // Could be @IsDateString() if strict ISO is enforced
  date?: string;
}
