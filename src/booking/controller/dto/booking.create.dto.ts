import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString, IsNotEmpty,  ValidateNested } from 'class-validator';
import { IsExclusiveFields } from 'src/booking/utils/exclusive-field-validator';
import { Tourist } from 'src/booking/vo/helper.vo';

export default class CreateBookingDTO {
  @IsString()
  @IsNotEmpty()
  public readonly status: string;

  @IsDateString()
  public readonly bookedOn: string;

  @Type(() => Tourist)
  @ValidateNested()
  public readonly tourist: Map<string, Tourist>;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsExclusiveFields()
  public readonly tour?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsExclusiveFields()
  public readonly tourPackage?: string;
}