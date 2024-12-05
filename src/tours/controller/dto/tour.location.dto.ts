import { IsString } from "class-validator";

export class TourLocationDTO {
    @IsString()
    public name: string;
  
    @IsString()
    public city: string;
  
    @IsString()
    public country: string;
  }
  