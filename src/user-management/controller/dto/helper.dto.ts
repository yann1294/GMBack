import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, IsDateString, ValidateNested, IsOptional, IsNumber } from "class-validator";
import { IsBuffer } from "src/user-management/utils/is-buffer.decorator";
import { IsUrlOrFile } from "src/user-management/utils/is-url-or-filedto.decorator";
import { Role } from "src/user-management/vo/helper.vo";

export class FileDTO {    
    @IsString()
  @IsNotEmpty()
    public fieldName: string;

    @IsString()
  @IsNotEmpty()
    public encoding: string;

    @IsString()
  @IsNotEmpty()
    public mimeType: string;

    @IsString()
  @IsNotEmpty()
    public fileName: string;

    @IsNumber()
  @IsNotEmpty()
    public size: number;

    @IsBuffer()
    public buffer: Buffer;

    constructor(fieldName: string, encoding: string, mimeType: string, fileName: string, size: number, buffer: Buffer) {
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

    @IsUrlOrFile()
    @IsOptional()
    public profilePhoto: string | FileDTO;

    // will be assigned automatically based on route
    // @Type(() => Role)
    // @ValidateNested()
    // public role: Role;

    @IsString()
  @IsNotEmpty()
    public accountStatus: string;

    @IsDateString()
    public createdAt: string;

    @IsDateString()
    public updatedAt: string;
}