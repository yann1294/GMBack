import {
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';
import { TourLocationDTO } from './tour.location.dto';
import { Type } from 'class-transformer';
import { ActivityDTO } from './tour.activity.dto';
import { Optional } from '@nestjs/common';

export class UpdateTourDTO {
  @IsString()
  @Optional()
  public id?: string;

  @IsString()
  @IsOptional()
  public name?: string;

  @IsNumber()
  @IsOptional()
  public price?: number;

  @IsDateString()
  public date: Date;

  @IsArray()
  @IsString({each: true})
  @IsOptional()
  public images: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  public durationDays?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  public discount?: number;

  @IsNumber()
  @IsOptional()
  public numberOfSeats?: number;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsBoolean()
  @IsOptional()
  public isAvailable?: boolean;

  @ValidateNested()
  @Type(() => TourLocationDTO)
  @IsOptional()
  location?: TourLocationDTO;

  @ValidateNested({ each: true })
  @Type(() => ActivityDTO)
  @IsOptional()
  activities?: Map<number, ActivityDTO>;
}
