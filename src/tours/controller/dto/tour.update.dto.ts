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

export class PartialTourLocationDTO extends PartialType(TourLocationDTO) {}

export class UpdateTourDTO extends PartialType(CreateTourDTO) {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested()
  @Type(() => PartialTourLocationDTO)
  location: TourLocationDTO;

  // <--- Add this: an optional "activities" key so that class-transformer does not strip it out.
  // Because our pipe will already have turned the raw JSON into a Map<number,Activity>, we can simply allow "any" here.
  @IsOptional()
  @IsObject()
  @Allow() // <- simplest: accept whatever shape
  activities?: Map<number, Activity>;
}
