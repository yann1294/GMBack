import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { log } from 'console';
import { TourDTO } from './dto/tour.dto';
import { TourVO } from './vo/tour.vo';

@Injectable()
export class TourValidationPipe implements PipeTransform<any, Promise<TourVO>> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<TourVO> {
    log(metadata);
    // checking if value if empty
    if (!value) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // validate input data across TourDTO
    const tourDto = plainToInstance(TourDTO, value);
    const errors = await validate(tourDto);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // transform data into TourVO
    return plainToInstance(TourVO, value);
  }
}
