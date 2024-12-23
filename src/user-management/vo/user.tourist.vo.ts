import { Type } from "class-transformer";
import { User } from "../utils/user.abstract";
import { Identification } from "./helper.vo";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Tourist } from "../dao/tourist.entity";

export class TouristVO extends User {
    @Type(() => Identification)
    @IsOptional()
    public identification: Identification;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    public spokenLanguages: string[];

    toEntity(): Tourist {
        return new Tourist(
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
            this.spokenLanguages
          );
    }
}