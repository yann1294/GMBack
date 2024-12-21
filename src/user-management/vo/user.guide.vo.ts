import { Type } from "class-transformer";
import { User } from "../utitls/user.abstract";
import { Identification } from "./helper.vo";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import { Guide } from "../dao/guide.entity";

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

    toEntity(): Guide {
        return new Guide(
            this.uid,
            this.firstName,
            this.lastName,
            this.password,
            this.phoneNumber,
            this.emailAddress,
            this.profilePhoto,
            this.role,
            this.accountStatus,
            this.createdAt,
            this.updatedAt,
            this.identification,
            this.spokenLanguages,
            this.availability
          );
    }
}
