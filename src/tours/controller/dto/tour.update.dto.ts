import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDTO } from './tour.create.dto';
import {
  Allow,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TourLocationDTO } from './tour.location.dto';
import { Type } from 'class-transformer';
import { Activity } from 'src/tours/vo/helper.vo';
import { ActivityDTO } from './tour.activity.dto';

/**
 * Partial variant of TourLocationDTO for updates.
 * All fields become optional for patch semantics.
 */
export class PartialTourLocationDTO extends PartialType(TourLocationDTO) {}

/**
 * DTO for updating a Tour.
 * - Extends CreateTourDTO but marks fields optional (PartialType).
 * - Adds required id and allows flexible activities updates.
 */
export class UpdateTourDTO extends PartialType(CreateTourDTO) {
  // Tour identifier to update
  @IsString()
  @IsNotEmpty()
  id: string;

  // Location can be partially updated; still validated as nested structure
  @ValidateNested()
  @Type(() => PartialTourLocationDTO)
  location: TourLocationDTO;

  /**
   * Optional activities map to update.
   * Marked with Allow + IsObject/IsOptional so class-transformer does not strip it.
   * Actual normalisation to Map<number, Activity> happens later in the VO/entity layer.
   */
  @IsOptional()
  @IsObject()
  @Allow()
  activities?: Map<number, Activity>;
}
