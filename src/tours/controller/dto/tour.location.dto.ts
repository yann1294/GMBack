import { IsString, IsNotEmpty } from "class-validator";

export class TourLocationDTO {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public city: string;

  @IsString()
  @IsNotEmpty()
  public country: string;
}
