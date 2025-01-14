import { PartialType } from "@nestjs/mapped-types";
import { CreateTouristDTO } from "./tourist.create.dto";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateTouristDTO extends PartialType(CreateTouristDTO) {
    @IsString()
  @IsNotEmpty()
    public uid: string
}