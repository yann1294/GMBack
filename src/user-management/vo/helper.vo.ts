import { IsIn, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { IsUrlOrFile } from "../utils/is-url-or-filedto.decorator";
import { FileDTO } from "../controller/dto/helper.dto";

export class Role {
    @IsString()
  @IsNotEmpty()
    @IsOptional()
    @IsIn(['admin', 'guide', 'tourist'])
    public name: string;
}

export class Identification {
    @IsOptional()
    @IsUrlOrFile()
    public file: string | FileDTO;

    @IsString()
  @IsNotEmpty()
    @IsOptional()
    public type: string;
}
