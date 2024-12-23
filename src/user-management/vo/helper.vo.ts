import { IsOptional, IsString } from "class-validator";

export class Role {
    @IsString()
    @IsOptional()
    public name: string;
}

export class Identification {
    @IsString()
    @IsOptional()
    public file: string;

    @IsString()
    @IsOptional()
    public type: string;
}
