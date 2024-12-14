import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import ExclusiveFieldsValidator from 'src/booking/utilitary/exclusive-field-validator';

export default class BookingDTO {
  @IsString()
  @IsOptional()
  public readonly id?: string;

  @IsString()
  public readonly status: string;

  @IsDateString()
  public readonly bookedOn: Date;

  @IsArray()
  @IsString({ each: true })
  public readonly tourist: string[];

  @IsString()
  @IsOptional()
  @Validate(ExclusiveFieldsValidator)
  public readonly tour?: string;

  @IsString()
  @IsOptional()
  @Validate(ExclusiveFieldsValidator)
  public readonly tourPackage?: string;
}
