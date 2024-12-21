import { Type } from "class-transformer";
import { User } from "../utitls/user.abstract";
import { Identification } from "./helper.vo";
import { IsArray, IsOptional, IsString } from "class-validator";

export class TouristVO extends User {
    @Type(() => Identification)
    @IsOptional()
    public identification: Identification;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    public spokenLanguages: string[];
}