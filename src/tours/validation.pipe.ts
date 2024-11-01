import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Tour } from './entities/tour.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { log } from 'console';

@Injectable()
export class TourValidationPipe implements PipeTransform<any, Promise<Tour>> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<Tour> {
    log(metadata);
    // checking if value if empty
    if (!value) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // transforms body to tour
    const tour = plainToInstance(Tour, value);
    const errors = await validate(tour);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    } else {
      return tour;
    }
  }
}
