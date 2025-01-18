import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { log } from 'console';
import { UpdateGuideDTO } from './dto/guide.update.dto';
import { CreateGuideDTO } from './dto/guide.create.dto';
import { TouristVO } from '../vo/tourist.vo';
import { UpdateTouristDTO } from './dto/tourist.update.dto';
import { CreateTouristDTO } from './dto/tourist.create.dto';

@Injectable()
export class TouristValidationPipe
  implements PipeTransform<any, Promise<TouristVO>>
{
  constructor(private readonly origin: string = 'default') {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<TouristVO> {
    log(metadata);
    // checking if value if empty
    if (!value) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // validate input data against TouristDto
    const touristDto =
      this.origin == 'update'
        ? plainToInstance(UpdateTouristDTO, value)
        : plainToInstance(CreateTouristDTO, value);
    const errors = await validate(touristDto);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // transform data into TouristVO
    return plainToInstance(TouristVO, value);
  }
}
