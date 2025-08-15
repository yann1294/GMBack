import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDTO } from './package.create.dto';
import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdatePackageDTO extends PartialType(CreatePackageDTO) {
  @IsString()
  @IsNotEmpty()
  public id: string;

  // @IsOptional()
  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // tours?: string[];
}
