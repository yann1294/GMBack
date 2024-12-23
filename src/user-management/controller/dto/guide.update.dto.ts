import { PartialType } from "@nestjs/mapped-types";
import { CreateGuideDTO } from "./guide.create.dto";

export class UpdateGuideDTO extends PartialType(CreateGuideDTO) {}