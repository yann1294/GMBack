import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { TourLocation, Activity, User } from '../../vo/helper.vo';

export class TourDTO {
  @IsString()
  public readonly id: string;

  @IsString()
  public readonly name: string;

  @ValidateNested()
  @Type(() => TourLocation)
  public readonly location: TourLocation;

  @IsNumber()
  public readonly price: number;

  @IsNumber()
  @Min(0)
  public readonly durationDays: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  public readonly discount: number;

  @IsBoolean()
  public readonly isAvailable: boolean;

  @ValidateNested()
  @Type(() => User)
  public readonly guide: User;

  @ValidateNested({ each: true })
  @Type(() => Activity)
  public readonly activities: Map<number, Activity>;
}
