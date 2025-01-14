import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDTO } from './tour.create.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTourDTO extends PartialType(CreateTourDTO) {
    @IsString()
  @IsNotEmpty()
    public id: string
}