import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PackageLocationDTO } from './package.location.dto';
import { Type } from 'class-transformer';
import { User } from 'src/payment/vo/helper.vo';

export class CreatePackageDTO {
  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;

  @IsString()
  @IsOptional()
  public readonly images?: string[];

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
  @Type(() => PackageLocationDTO)
  location: PackageLocationDTO;
}
