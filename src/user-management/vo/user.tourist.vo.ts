import { User } from "../utils/user.abstract";
import { Identification } from "./helper.vo";
import { IsArray, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { Tourist } from "../dao/tourist.entity";
import { Expose, Type } from "class-transformer";

export class TouristVO extends User {
    @Type(() => Identification)
    @IsOptional()
    @Expose({ name: 'identification' })
    private _identification: Identification;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Expose({ name: 'spokenLanguages' })
    private _spokenLanguages: string[];

    get identification(): Identification {
        return this._identification;
    }

    set identification(value: Identification) {
        this._identification = value;
    }

    get spokenLanguages(): string[] {
        return this._spokenLanguages;
    }

    set spokenLanguages(value: string[]) {
        this._spokenLanguages = value;
    }

    toEntity(): Tourist {
        return new Tourist(
            this.uid,
            this.firstName,
            this.lastName,
            this.phoneNumber,
            this.emailAddress,
            this.profilePhoto,
            this.role,
            this.accountStatus,
            this.createdAt,
            this.updatedAt,
            this._identification,
            this._spokenLanguages
        );
    }
}