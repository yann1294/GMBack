import { PartialType } from "@nestjs/mapped-types";
import { CreateTouristDTO } from "./tourist.create.dto";
import { IsString } from "class-validator";

export class UpdateTouristDTO extends PartialType(CreateTouristDTO) {
    @IsString()
    public uid: string
}