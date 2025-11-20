import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Custom class-validator constraint to ensure *only one* of
 * two mutually exclusive fields is present (e.g. tour or tourPackage).
 */
@ValidatorConstraint({ name: 'ExclusiveFields', async: false })
class ExclusiveFieldsValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    const tour = object.tour;
    const tourPackage = object.tourPackage;
    return !(tour && tourPackage); // Valid if NOT (both defined) → at most one field set
  }

  defaultMessage(args: ValidationArguments): string {
    return "Only one of 'tour' or 'tourPackage' should be provided.";
  }
}

/**
 * Decorator factory to apply the ExclusiveFieldsValidator
 * on a DTO property (usually a dummy property).
 */
export function IsExclusiveFields(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsExclusiveFields',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ExclusiveFieldsValidator,
    });
  };
}
