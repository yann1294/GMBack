import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { error, log } from 'console';
import { TourVO } from '../vo/tour.master.vo';
import { UpdateTourDTO } from './dto/tour.update.dto';
import { CreateTourDTO } from './dto/tour.create.dto';
import { errorHandler } from 'src/shared/services/data.service';

@Injectable()
export class TourValidationPipe implements PipeTransform<any, Promise<TourVO>> {
  constructor(private readonly origin: string = 'create') {}
  // constructor(@Inject('TOUR_PIPE_ORIGIN') private readonly origin: string) {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<TourVO> {
    try {
      log(metadata);
      // parse json data
      value = JSON.parse(value);
      // console.log("Parse", value);
      // checking if value if empty
      if (!value || Object.keys(value).length === 0) {
        throw errorHandler(
          new BadRequestException('Request body cannot be empty'),
        );
      }

      console.log('Validate', value);

      // validate input data against TourDTO
      const tourDto =
        this.origin == 'update'
          ? plainToInstance(UpdateTourDTO, value)
          : plainToInstance(CreateTourDTO, value);
      const errors = await validate(tourDto);

      // checking if there are any errors
      if (errors.length > 0) {
        throw new BadRequestException(
          errorHandler({ message: JSON.stringify(errors), code: 500 }),
        );
      }

      // transform data into TourVO
      return plainToInstance(TourVO, value);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(errorHandler(error));
    }
  }
}
