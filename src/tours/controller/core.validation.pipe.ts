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

/**
 * TourValidationPipe
 * - Parses raw JSON body (string) into an object.
 * - Validates it against CreateTourDTO or UpdateTourDTO depending on origin.
 * - On success, transforms the payload into a TourVO.
 */
@Injectable()
export class TourValidationPipe implements PipeTransform<any, Promise<TourVO>> {
  constructor(private readonly origin: string = 'create') {}
  // constructor(@Inject('TOUR_PIPE_ORIGIN') private readonly origin: string) {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<TourVO> {
    try {
      log(metadata);
      // parse json data
      // 1) Parse the incoming body (expected as JSON string)
      value = JSON.parse(value);
      // console.log("Parse", value);
      // checking if value if empty
      // 2) Reject empty payloads
      if (!value || Object.keys(value).length === 0) {
        throw errorHandler(
          new BadRequestException('Request body cannot be empty'),
        );
      }

      console.log('Validate', value);

      // validate input data against TourDTO
      // 3) Choose DTO based on origin: create vs update
      const tourDto =
        this.origin == 'update'
          ? plainToInstance(UpdateTourDTO, value)
          : plainToInstance(CreateTourDTO, value);
      const errors = await validate(tourDto);

      // checking if there are any errors
      if (errors.length > 0) {
        // Wrap validation errors in a BadRequestException and pass through central errorHandler
        throw new BadRequestException(
          errorHandler({ message: JSON.stringify(errors), code: 500 }),
        );
      }

      // transform data into TourVO
      // 5) Transform validated payload into TourVO
      return plainToInstance(TourVO, value);
    } catch (error) {
      console.error(error);
      // Normalise errors through shared errorHandler
      throw new BadRequestException(errorHandler(error));
    }
  }
}
