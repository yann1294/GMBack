// auth.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * A generic validation pipe that:
 * 1) Converts plain JS objects into an instance of a given DTO class
 * 2) Runs class-validator on that instance
 * 3) Throws BadRequestException if validation fails
 */
@Injectable()
export class AuthValidationPipe implements PipeTransform {
  constructor(private readonly dtoClass: any) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // Convert plain object to an instance of the specified DTO class
    const dtoInstance = plainToInstance(this.dtoClass, value);

    // Perform validation
    const errors = await validate(dtoInstance, {
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown properties are present
    });

    if (errors.length > 0) {
      // You could customize error messages further if desired
      throw new BadRequestException('Validation failed for request body');
    }

    // Return the validated & transformed DTO
    return dtoInstance;
  }
}
