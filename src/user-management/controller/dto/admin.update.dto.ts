import { PartialType } from "@nestjs/mapped-types";
import { CreateAdminDTO } from "./admin.create.dto";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateAdminDTO extends PartialType(CreateAdminDTO) {
    @IsString()
  @IsNotEmpty()
    public uid: string
}