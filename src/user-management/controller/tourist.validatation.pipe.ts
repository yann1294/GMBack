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
import { TouristVO } from '../vo/user.tourist.vo';
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

    // validate input data against TouristVo
    const touristVo =
      this.origin == 'update'
        ? plainToInstance(UpdateTouristDTO, value)
        : plainToInstance(CreateTouristDTO, value);
    const errors = await validate(touristVo);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // transform data into TouristVO
    return plainToInstance(TouristVO, value);
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
