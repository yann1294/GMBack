import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { log } from 'console';
import { GuideVO } from '../vo/guide.vo';
import { UpdateGuideDTO } from './dto/guide.update.dto';
import { CreateGuideDTO } from './dto/guide.create.dto';

@Injectable()
export class GuideValidationPipe
  implements PipeTransform<any, Promise<GuideVO>>
{
  constructor(private readonly origin: string = 'default') {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<GuideVO> {
    log(metadata);
    // checking if value if empty
    if (!value) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // validate input data against GuideDTO
    const guideDto =
      this.origin == 'update'
        ? plainToInstance(UpdateGuideDTO, value)
        : plainToInstance(CreateGuideDTO, value);
    const errors = await validate(guideDto);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // transform data into GuidVO
    return plainToInstance(GuideVO, value);
  }
}
