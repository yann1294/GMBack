import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDTO } from './package.create.dto';
import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';

/**
 * DTO for general package updates.
 * - Based on CreatePackageDTO but all fields are optional.
 * - Adds a required id field to identify the document.
 */
export class UpdatePackageDTO extends PartialType(CreatePackageDTO) {
  // Package identifier to update (required)
  @IsString()
  @IsNotEmpty()
  public id: string;

  // @IsOptional()
  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // tours?: string[];
}
