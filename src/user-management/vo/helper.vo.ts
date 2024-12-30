import { IsIn, IsOptional, IsString } from "class-validator";
import { IsUrlOrFile } from "../utils/is-url-or-filedto.decorator";
import { FileDTO } from "../controller/dto/helper.dto";

export class Role {
    @IsString()
    @IsOptional()
    @IsIn(['admin', 'guide', 'tourist'])
    public name: string;
}

export class Identification {
    @IsOptional()
    @IsUrlOrFile()
    public file: string | FileDTO;

    @IsString()
    @IsOptional()
    public type: string;
}
