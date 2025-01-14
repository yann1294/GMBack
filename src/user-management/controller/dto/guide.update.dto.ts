import { PartialType } from "@nestjs/mapped-types";
import { CreateGuideDTO } from "./guide.create.dto";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateGuideDTO extends PartialType(CreateGuideDTO) {
    @IsString()
  @IsNotEmpty()
    public uid: string
}