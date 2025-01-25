import { Type } from "class-transformer";
import { UserDTO } from "./helper.dto";
import { IsArray, IsBoolean, IsOptional, IsString, IsNotEmpty,  ValidateNested } from "class-validator";
import { Identification } from "src/user-management/vo/helper.vo";

export class CreateGuideDTO extends UserDTO {
    @Type(() => Identification)
    @ValidateNested()
    public identification: Identification;

    @IsArray()
    @IsString({each: true})
    public spokenLanguages: string[];

    @IsBoolean()
    public availability: boolean;
}