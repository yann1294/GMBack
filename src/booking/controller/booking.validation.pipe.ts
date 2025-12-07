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
import CreateBookingDTO from './dto/booking.create.dto';

/**
 * BookingValidationPipe
 * - Validates incoming request body for booking endpoints.
 * - Uses CreateBookingDTO for create, UpdateBookingDTO for update.
 * - On success returns a BookingVO instance.
 */
@Injectable()
export class BookingValidationPipe
  implements PipeTransform<any, Promise<BookingVO>>
{
  // origin distinguishes create vs update behaviour
  constructor(private readonly origin: string = 'default') {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<BookingVO> {
    log(metadata);
    // Reject completely missing bodies
    if (!value) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // Pick the appropriate DTO based on origin
    const tourDto =
      this.origin == 'update'
        ? plainToInstance(UpdateBookingCreateDTO, value)
        : plainToInstance(CreateBookingDTO, value);
    // Run class-validator validation over DTO
    const errors = await validate(tourDto);

    // checking if there are any errors
    if (errors.length > 0) {
      // Forward validation details back to caller
      throw new BadRequestException(errors);
    }

    // Transform validated payload into a BookingVO
    return plainToInstance(BookingVO, value);
  }
}
