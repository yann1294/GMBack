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

/**
 * PackageValidationPipe
 * - Parses JSON body into a plain object.
 * - Validates it against CreatePackageDTO or UpdatePackageDTO.
 * - Returns a PackageVO if validation passes, otherwise throws 400.
 */
@Injectable()
export class PackageValidationPipe
  implements PipeTransform<any, Promise<PackageVO>>
{
  // origin tells whether we're validating for 'update' or the default (create)
  constructor(private readonly origin: string = 'default') {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<PackageVO> {
    log(metadata);
    // 1) Parse body (expected as JSON string)
    value = JSON.parse(value);
    // console.log("Parse", value);
    // checking if value if empty
    // 2) Reject empty payloads
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // validate input data against PackageDTO
    // 3) Choose DTO for validation based on origin
    const packageDto =
      this.origin == 'update'
        ? plainToInstance(UpdatePackageDTO, value)
        : plainToInstance(CreatePackageDTO, value);

    console.log('Package DTO', packageDto);
    // 4) Validate DTO
    const errors = await validate(packageDto);

    // checking if there are any errors
    if (errors.length > 0) {
      // Directly throw validation errors as BadRequest
      throw new BadRequestException(errors);
    }

    // transform data into PackageVO
    // 5) Transform payload to PackageVO for downstream layers
    return plainToInstance(PackageVO, value);
  }
}
