import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export default class UpdateBookingCreateDTO {
  @IsString()
  @IsOptional()
  public readonly id: string;

  @IsString()
  @IsOptional()
  public readonly status: string;

  @IsDateString()
  @IsOptional()
  public readonly bookedOn: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public readonly tourist: string[];

  @IsString()
  @IsOptional()
  public readonly tour?: string;

  @IsString()
  @IsOptional()
  public readonly tourPackage?: string;
}
