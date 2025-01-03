import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { log } from 'console';
import { AdminVO } from '../vo/admin.vo';
import { UpdateAdminDTO } from './dto/admin.update.dto';
import { CreateAdminDTO } from './dto/admin.create.dto';
  
  @Injectable()
  export class AdminValidationPipe
    implements PipeTransform<any, Promise<AdminVO>>
  {
    constructor(private readonly origin: string = 'default') {}
    async transform(value: any, metadata: ArgumentMetadata): Promise<AdminVO> {
      log(metadata);
      // checking if value if empty
      if (!value) {
        throw new BadRequestException('Request body cannot be empty');
      }
  
      // validate input data against AdminDTO
      const adminDto =
        this.origin == 'update'
          ? plainToInstance(UpdateAdminDTO, value)
          : plainToInstance(CreateAdminDTO, value);
      const errors = await validate(adminDto);
  
      // checking if there are any errors
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
  
      // transform data into AdminVO
      return plainToInstance(AdminVO, value);
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
  