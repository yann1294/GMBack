import { Type } from "class-transformer";
import { IsString, IsEmail, IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Role } from "src/user-management/utils/helper";
import { IsBuffer } from "src/user-management/utils/is-buffer.decorator";

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
  @IsOptional()
  public profilePhoto: string | FileDTO;

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

export class FileDTO {
  @IsString()
  public fieldName: string;

  @IsString()
  public encoding: string;

  @IsString()
  public mimeType: string;

  @IsString()
  public fileName: string;

  @IsNumber()
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