import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { TourLocationDTO } from './tour.location.dto';
import { ActivityDTO } from './tour.activity.dto';
import { User } from 'src/tours/vo/helper.vo';

export class CreateTourDTO {
  @IsString()
  public readonly id: string;

  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;

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

  @ValidateNested()
  @Type(() => User)
  guide: User;

  @ValidateNested()
  @Type(() => Object)
  @IsObject()
  toObject: { (): object };

  @ValidateNested()
  @Type(() => TourLocationDTO)
  location: TourLocationDTO;

  @ValidateNested()
  @Type(() => ActivityDTO)
  activities: ActivityDTO[];
}
