import { Type } from "class-transformer";
import { UserDTO } from "./helper.dto";
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { Identification } from "src/user-management/utils/helper";

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