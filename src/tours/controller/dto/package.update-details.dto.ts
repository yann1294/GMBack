// package.update-details.dto.ts
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePackageDTO } from './package.create.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Details-only: everything EXCEPT tours, and it's partial
export class UpdatePackageDetailsDTO extends PartialType(CreatePackageDTO) {
  @IsString()
  @IsNotEmpty()
  id: string;

  // If you do support date updates here, add it (since CreatePackageDTO currently has no date)
  @IsOptional()
  @IsString() // or @IsDateString() if you send ISO strings
  date?: string;
}
