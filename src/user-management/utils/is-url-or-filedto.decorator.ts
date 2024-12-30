import { registerDecorator, ValidationOptions, ValidationArguments, IsUrl, isURL } from 'class-validator';
import { FileDTO } from '../controller/dto/helper.dto';

export function IsUrlOrFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUrlOrFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isURL(value) || typeof value === FileDTO.name;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a url or a File`;
        },
      },
    });
  };
}