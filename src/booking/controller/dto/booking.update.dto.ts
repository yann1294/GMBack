import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import CreateBookingDTO from './booking.create.dto';

export default class UpdateBookingCreateDTO extends PartialType(CreateBookingDTO) {

}
