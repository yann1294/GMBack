import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Tourist } from 'src/booking/vo/helper.vo';

export default class CreateBookingDTO {
  @IsString()
  @IsOptional()
  public readonly id?: string;

  @IsString()
  public readonly status: string;

  @IsDateString()
  public readonly bookedOn: string;

  @Type(() => Tourist)
  @ValidateNested()
  public readonly tourist: Map<String, Tourist>;

  @IsString()
  @IsOptional()
  public readonly tour?: string;

  @IsString()
  @IsOptional()
  public readonly tourPackage?: string;
}
