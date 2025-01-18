import { Type, Exclude } from "class-transformer";
import { IsString, IsEmail, IsDateString } from "class-validator";
import { Role } from "src/user-management/utils/helper";

export abstract class UserDTO {
    @IsString()
  @IsNotEmpty()
    public firstName: string;

    @IsString()
  @IsNotEmpty()
    public lastName: string;

    @IsString()
  @IsNotEmpty()
    public phoneNumber: string;

    @IsEmail()
    public emailAddress: string;

    @IsString()
    public profilePhoto: string;

    @Type(() => Role)
    public role: Role;

    @IsString()
  @IsNotEmpty()
    public accountStatus: string;

    @IsDateString()
    public createdAt: string;

    @IsDateString()
    public updatedAt: string;
}