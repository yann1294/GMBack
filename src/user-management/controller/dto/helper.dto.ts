import { Type, Exclude } from "class-transformer";
import { IsString, IsEmail, IsDateString } from "class-validator";
import { Role } from "src/user-management/utils/helper";

export abstract class UserDTO {
    @IsString()
    public uid: string;

    @IsString()
    public firstName: string;

    @IsString()
    public lastName: string;

    @IsString()
    public phoneNumber: string;

    @IsEmail()
    public emailAddress: string;

    @IsString()
    public profilePhoto: string;

    @Type(() => Role)
    public role: Role;

    @IsString()
    public accountStatus: string;

    @IsDateString()
    public createdAt: string;

    @IsDateString()
    public updatedAt: string;
}