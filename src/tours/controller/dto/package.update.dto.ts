import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDTO } from './package.create.dto';
import { IsString } from 'class-validator';

export class UpdatePackageDTO extends PartialType(CreatePackageDTO) {
    @IsString()
    public id: string
}
