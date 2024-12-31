import { PartialType } from "@nestjs/mapped-types";
import { CreateAdminDTO } from "./admin.create.dto";
import { IsString } from "class-validator";

export class UpdateAdminDTO extends PartialType(CreateAdminDTO) {
    @IsString()
    public uid: string
}