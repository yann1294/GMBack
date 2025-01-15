import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDTO } from './tour.create.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { TourLocationDTO } from './tour.location.dto';
import { Type } from 'class-transformer';

export class PartialTourLocationDTO extends PartialType(TourLocationDTO) {}

export class UpdateTourDTO extends PartialType(CreateTourDTO) {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested()
  @Type(() => PartialTourLocationDTO)
  location: TourLocationDTO;
}