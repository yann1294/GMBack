import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDTO } from './package.create.dto';

export class UpdatePackageDTO extends PartialType(CreatePackageDTO){
}
