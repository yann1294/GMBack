import { Type } from "class-transformer";
import { User } from "../utitls/user.abstract";
import { Identification } from "./helper.vo";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class GuideVO extends User {
    @Type(() => Identification)
    @IsOptional()
    public identification: Identification;

    @IsArray()
    @IsString({each: true})
    @IsOptional()
    public spokenLanguages: string[];

    @IsBoolean()
    @IsOptional()
    public availability: boolean;
}
