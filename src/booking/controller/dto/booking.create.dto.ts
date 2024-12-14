import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export default class BookingCreateDTO {
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
  public readonly tour?: string;

  @IsString()
  @IsOptional()
  public readonly tourPackage?: string;
}
