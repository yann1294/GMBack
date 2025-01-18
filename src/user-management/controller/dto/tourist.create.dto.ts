import { Identification } from "src/user-management/utils/helper";
import { UserDTO } from "./helper.dto";
import { Type } from "class-transformer";
import { IsArray, IsString, IsNotEmpty } from "class-validator";

export class CreateTouristDTO extends UserDTO {
    @Type(() => Identification)
    public identification: Identification;

    @IsArray()
    @IsString({ each: true })
    public spokenLanguages: string[];
}