import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TouristVO } from '../vo/user.tourist.vo';
import { UpdateTouristDTO } from './dto/tourist.update.dto';
import { CreateTouristDTO } from './dto/tourist.create.dto';
import { FastifyRequest } from 'fastify';
import { FileDTO } from './dto/helper.dto';
import { Identification } from '../vo/helper.vo';

@Injectable()
export class TouristValidationPipe
  implements PipeTransform<any, Promise<TouristVO>> {
  constructor(private readonly origin: string = 'default') {}

  async transform(req: FastifyRequest | any, metadata: ArgumentMetadata): Promise<TouristVO> {

    // checking whether request is multipart
    if (!req.isMultipart()) {
      throw new BadRequestException('Request must be multipart');
    }

    // data in request
    let files: Map<string, FileDTO> = new Map<string, FileDTO>();
    let data: object = {};

    for await (const part of req.parts()) {
      if (part.type === 'file') {
        files.set(part.fieldname, new FileDTO(
          part.fieldname,
          part.encoding,
          part.mimetype,
          part.filename,
          part.file.bytesRead,
          await part.toBuffer(),
        ));
      } else if (part.type === 'field' && part.fieldname === 'data') {
        data = JSON.parse(await part.value.toString());
      }
    }

    // checking whether file contains more than required files
    if (this.origin !== 'update' && files.size > 2) {
      throw new BadRequestException('Request must contain only two files');
    }

    // checking whether profilePhoto and identificationPhoto are present
    if (this.origin !== 'update' && (!files.has('profilePhoto') || !files.has('identificationPhoto'))) {
      throw new BadRequestException('Request must contain "profilePhoto" and "identificationPhoto"');
    }

    // checking whether data is present    
    if (this.origin !== "update" && Object.keys(data).length === 0) {
      throw new BadRequestException('JSON field "data" is required');
    }

    // validate input data against TouristDto
    const touristDto =
      this.origin == 'update'
        ? plainToInstance(UpdateTouristDTO, data)
        : plainToInstance(CreateTouristDTO, data);
    const errors = await validate(touristDto);

    // checking if there are any errors
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // transform data into TouristVO
    let tourist: TouristVO = plainToInstance(TouristVO, data);

    // adding profilePhoto and identificationPhoto to tourist if present
    if (files.has('profilePhoto')) {
      tourist.profilePhoto = files.get('profilePhoto');
    }
    if (files.has('identificationPhoto')) {
      // if identification is empty then type is not being updated
      if (tourist.identification === undefined) {
        tourist.identification = new Identification();
      }

      // set identification file
      tourist.identification.file = files.get('identificationPhoto');
    }

    return tourist;
  }
}

@Injectable()
export class HasAttribute implements PipeTransform<any, string | number> {
  constructor(private readonly parameters: string[]) { }
  transform(value: any, metadata: ArgumentMetadata): string | number {
    if (!value || !this.parameters.every((param) => param in value)) {
      throw new BadRequestException(
        `Body must contain { ${this.parameters.join(', ')} }`,
      );
    }
    return value;
  }
}
