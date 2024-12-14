import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ExclusiveFields', async: false })
export default class ExclusiveFieldsValidator
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    const tour = object.tour;
    const tourPackage = object.tourPackage;
    return !(tour && tourPackage); // Ensure only one of the fields is defined
  }

  defaultMessage(args: ValidationArguments): string {
    return "Only one of 'tour' or 'tourPackage' should be provided.";
  }
}
