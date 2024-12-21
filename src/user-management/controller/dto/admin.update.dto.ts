import { PartialType } from "@nestjs/mapped-types";
import { CreateAdminDTO } from "./admin.create.dto";

export class UpdateAdminDTO extends PartialType(CreateAdminDTO) {}