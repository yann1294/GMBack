import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { log } from 'console';
import { BookingVO } from '../vo/booking.master.vo';
import UpdateBookingCreateDTO from './dto/booking.update.dto';
import BookingDTO from './dto/booking.dto';

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
        : plainToInstance(BookingDTO, value);
    const errors = await validate(tourDto);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // transform data into BookingVO
    return plainToInstance(BookingVO, value);
  }
}

@Injectable()
export class HasAttribute implements PipeTransform<any, string | number> {
  constructor(private readonly parameters: string[]) {}
  transform(value: any, metadata: ArgumentMetadata): string | number {
    if (!value || !this.parameters.every((param) => param in value)) {
      throw new BadRequestException(
        `Body must contain { ${this.parameters.join(', ')} }`,
      );
    }
    return value;
  }
}
