import { PartialType } from "@nestjs/mapped-types";
import { CreateTouristDTO } from "./tourist.create.dto";

export class UpdateTouristDTO extends PartialType(CreateTouristDTO) {}