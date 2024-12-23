import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDTO } from './tour.create.dto';

export class UpdateTourDTO extends PartialType(CreateTourDTO) {}