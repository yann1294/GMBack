import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDTO } from './tour.create.dto';
import { IsString } from 'class-validator';

export class UpdateTourDTO extends PartialType(CreateTourDTO) {
    @IsString()
    public id: string
}