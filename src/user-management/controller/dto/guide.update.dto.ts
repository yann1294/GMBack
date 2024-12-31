import { PartialType } from "@nestjs/mapped-types";
import { CreateGuideDTO } from "./guide.create.dto";
import { IsString } from "class-validator";

export class UpdateGuideDTO extends PartialType(CreateGuideDTO) {
    @IsString()
    public uid: string
}