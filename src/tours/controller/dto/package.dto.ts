import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PackageLocationDTO } from './package.location.dto';
import { User } from 'src/payment/vo/helper.vo';

export class PackageDTO {
  @IsString() public readonly name: string;
  @ValidateNested()
  @Type(() => PackageLocationDTO)
  public readonly location: PackageLocationDTO;

  @IsNumber()
  public readonly price: number;

  @IsString()
  public readonly images: string[];
  
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
}
