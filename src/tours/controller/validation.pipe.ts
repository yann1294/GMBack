import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { log } from 'console';
import { TourVO } from '../vo/tour.master.vo';
import { TourDTO } from './dto/tour.dto';
import { UpdateTourDTO } from './dto/tour.update.dto';

@Injectable()
export class TourValidationPipe implements PipeTransform<any, Promise<TourVO>> {
  constructor(private readonly origin: string = 'default') { }
  async transform(value: any, metadata: ArgumentMetadata): Promise<TourVO> {
    log(metadata);
    // checking if value if empty
    if (!value) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // validate input data against TourDTO
    const tourDto = this.origin == "update" ? plainToInstance(UpdateTourDTO, value) : plainToInstance(TourDTO, value);
    const errors = await validate(tourDto);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // transform data into TourVO
    return plainToInstance(TourVO, value);
  }
}