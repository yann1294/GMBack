import { IsString, IsOptional, IsEmail, IsDateString, IsIn, IsUrl } from "class-validator";
import { Role } from "../vo/helper.vo";
import { Type } from "class-transformer";
import { IsUrlOrFile } from "./is-url-or-filedto.decorator";
import { FileDTO } from "../controller/dto/helper.dto";

export abstract class User {
    @IsString()
    @IsOptional()
    public uid: string;

    @IsString()
    @IsOptional()
    public firstName: string;

    @IsString()
    @IsOptional()
    public lastName: string;

    @IsString()
    @IsOptional()
    public phoneNumber: string;

    @IsEmail()
    @IsOptional()
    public emailAddress: string;

    @IsOptional()
    @IsUrlOrFile()
    public profilePhoto: string | FileDTO;

    @Type(() => Role)
    @IsOptional()
    public role: Role;

    @IsString()
    @IsOptional()
    @IsIn(["active", "inactive"])
    public accountStatus: string;

    @IsDateString()
    @IsOptional()
    public createdAt: string;

    @IsDateString()
    @IsOptional()
    public updatedAt: string;
}
