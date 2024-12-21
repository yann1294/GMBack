import { IsString, IsOptional, IsEmail, IsDateString } from "class-validator";
import { Role } from "../vo/helper.vo";
import { Type } from "class-transformer";

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
    public password: string;

    @IsString()
    @IsOptional()
    public phoneNumber: string;

    @IsEmail()
    @IsOptional()
    public emailAddress: string;

    @IsString()
    @IsOptional()
    public profilePhoto: string;

    @Type(() => Role)
    @IsOptional()
    public role: Role;

    @IsString()
    @IsOptional()
    public accountStatus: string;

    @IsDateString()
    @IsOptional()
    public createdAt: string;

    @IsDateString()
    @IsOptional()
    public updatedAt: string;
}
