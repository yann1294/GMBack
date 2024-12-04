import {
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { TourLocationDTO } from './tour.location.dto';
import { Type } from 'class-transformer';
import { ActivityDTO } from './tour.activity.dto';

export class UpdateTourDTO {
  @IsString()
  public readonly id: string;

  @IsString()
  @IsOptional()
  public readonly name: string;

  @IsNumber()
  @IsOptional()
  public readonly price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  public readonly durationDays: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  public readonly discount: number;

  @IsNumber()
  @IsOptional()
  public readonly numberOfSeats: number;

  @IsString()
  @IsOptional()
  public readonly description: number;

  @IsBoolean()
  @IsOptional()
  public readonly isAvailable: boolean;

  @ValidateNested()
  @Type(() => TourLocationDTO)
  @IsOptional()
  location: TourLocationDTO;

  @ValidateNested()
  @Type(() => ActivityDTO)
  @IsOptional()
  activity: ActivityDTO;
}
