import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
  IsObject,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import { TourLocationDTO } from './tour.location.dto';
import { ActivityDTO } from './tour.activity.dto';

export class CreateTourDTO {
  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;

  @IsDateString()
  public date: Date;

  @IsArray()
  @IsString({each: true})
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
  public readonly description: string;

  @IsBoolean()
  public readonly isAvailable: boolean;

  @IsString()
  public readonly guide: string;

  @ValidateNested()
  @Type(() => Object)
  @IsObject()
  toObject: { (): object };

  @ValidateNested()
  @Type(() => TourLocationDTO)
  location: TourLocationDTO;

  @ValidateNested()
  @Type(() => ActivityDTO)
  activities: Map<number, ActivityDTO>;
}
