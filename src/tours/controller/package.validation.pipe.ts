import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { log } from 'console';
import { PackageVO } from '../vo/package.master.vo';
import { UpdatePackageDTO } from './dto/package.update.dto';
import { CreatePackageDTO } from './dto/package.create.dto';

@Injectable()
export class PackageValidationPipe
  implements PipeTransform<any, Promise<PackageVO>>
{
  constructor(private readonly origin: string = 'default') {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<PackageVO> {
    log(metadata);
    // checking if value if empty
    if (!value) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // validate input data against PackageDTO
    const packageDto =
      this.origin == 'update'
        ? plainToInstance(UpdatePackageDTO, value)
        : plainToInstance(CreatePackageDTO, value);
    const errors = await validate(packageDto);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // transform data into PackageVO
    return plainToInstance(PackageVO, value);
  }
}
