import { Type } from "class-transformer";
import { IsString, IsEmail, IsDateString, ValidateNested, IsOptional } from "class-validator";
import { IsBuffer } from "src/user-management/utils/is-buffer.decorator";
import { IsUrlOrFile } from "src/user-management/utils/is-url-or-filedto.decorator";
import { Role } from "src/user-management/vo/helper.vo";

export class FileDTO {    
    @IsString()
    public fieldName: string;

    @IsString()
    public encoding: string;

    @IsString()
    public mimeType: string;

    @IsString()
    public fileName: string;

    @IsString()
    public size: string;

    @IsBuffer()
    public buffer: Buffer;

    constructor(fieldName: string, encoding: string, mimeType: string, fileName: string, size: string, buffer: Buffer) {
        this.fieldName = fieldName;
        this.encoding = encoding;
        this.mimeType = mimeType;
        this.fileName = fileName;
        this.size = size;
        this.buffer = buffer;
    }
}


export abstract class UserDTO {
    @IsString()
    public firstName: string;

    @IsString()
    public lastName: string;

    @IsString()
    public phoneNumber: string;

    @IsEmail()
    public emailAddress: string;

    @IsUrlOrFile()
    @IsOptional()
    public profilePhoto: string | FileDTO;

    // will be assigned automatically based on route
    // @Type(() => Role)
    // @ValidateNested()
    // public role: Role;

    @IsString()
    public accountStatus: string;

    @IsDateString()
    public createdAt: string;

    @IsDateString()
    public updatedAt: string;
}