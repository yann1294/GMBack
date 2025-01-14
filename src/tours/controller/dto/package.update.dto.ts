import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDTO } from './package.create.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePackageDTO extends PartialType(CreatePackageDTO) {
    @IsString()
  @IsNotEmpty()
    public id: string
}
