import { User } from "../utils/user.abstract";
import { Identification } from "./helper.vo";
import { IsArray, IsBoolean, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { Guide } from "../dao/guide.entity";
import { Expose, Type } from "class-transformer";

export class GuideVO extends User {
    private _identification: Identification;
    private _spokenLanguages: string[];
    private _availability: boolean;

    @Expose({ name: 'identification' })
    @Type(() => Identification)
    @IsOptional()
    public get identification(): Identification {
        return this._identification;
    }

    public set identification(value: Identification) {
        this._identification = value;
    }

    @Expose({ name: 'spokenLanguages' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    public get spokenLanguages(): string[] {
        return this._spokenLanguages;
    }

    public set spokenLanguages(value: string[]) {
        this._spokenLanguages = value;
    }

    @Expose({ name: 'availability' })
    @IsBoolean()
    @IsOptional()
    public get availability(): boolean {
        return this._availability;
    }

    public set availability(value: boolean) {
        this._availability = value;
    }

    toEntity(): Guide {
        return new Guide(
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
            this.identification,
            this.spokenLanguages,
            this.availability
        );
    }
}
