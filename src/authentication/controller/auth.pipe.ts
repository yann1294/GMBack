import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { log } from 'console';
import { BookingVO } from '../../booking/vo/booking.master.vo';
import UpdateBookingCreateDTO from '../../booking/controller/dto/booking.update.dto';
import CreateBookingDTO from '../../booking/controller/dto/booking.create.dto';

@Injectable()
export class BookingValidationPipe
  implements PipeTransform<any, Promise<BookingVO>>
{
  constructor(private readonly origin: string = 'default') {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<BookingVO> {
    log(metadata);
    // checking if value if empty
    if (!value) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // validate input data against TourDTO
    const tourDto =
      this.origin == 'update'
        ? plainToInstance(UpdateBookingCreateDTO, value)
        : plainToInstance(CreateBookingDTO, value);
    const errors = await validate(tourDto);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // transform data into BookingVO
    return plainToInstance(BookingVO, value);
  }
}