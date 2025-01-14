import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotEmptyString(origin: "create" | "update" = "create", validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsNotEmptyString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log("Groups", args)
          return origin === "create" ? !((value as string).trim() === "") : value === undefined ? true : !((value as string).trim() === "");
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be empty or contain and empty string`;
        },
      },
    });
  };
}