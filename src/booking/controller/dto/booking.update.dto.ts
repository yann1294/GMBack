import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsDateString, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import CreateBookingDTO from './booking.create.dto';

export default class UpdateBookingDTO extends PartialType(CreateBookingDTO) {
    @IsString()
  @IsNotEmpty()
    public id: string
}
