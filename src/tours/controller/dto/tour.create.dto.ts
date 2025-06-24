import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
  IsObject,
  IsOptional,
  IsDateString,
  IsArray,
  Allow,
} from 'class-validator';
import { TourLocationDTO } from './tour.location.dto';
import { ActivityDTO } from './tour.activity.dto';

export class CreateTourDTO {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;

  @IsDateString()
  public date: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public images: string[];

  @IsNumber()
  @Min(0)
  public readonly durationDays: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  public readonly discount: number;

  @IsNumber()
  public readonly numberOfSeats: number;

  @IsString()
  @IsNotEmpty()
  public readonly description: string;

  @IsBoolean()
  public readonly isAvailable: boolean;

  @IsString()
  @IsNotEmpty()
  public readonly guide: string;

  @ValidateNested()
  @Type(() => TourLocationDTO)
  location: TourLocationDTO;

  @ValidateNested()
  @Type(() => ActivityDTO)
  @Allow() // <- simplest: accept whatever shape
  activities: Map<number, ActivityDTO>;
}
