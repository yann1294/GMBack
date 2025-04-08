// auth.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LocalAuthVO } from '../vo/auth.local.vo';
import { AuthSigninDTO } from './dto/auth.signin.dto';
import { AuthSignupDTO } from './dto/auth.signup.dto';
import { AuthUpdateDTO } from './dto/auth.update.dto';
import { OAuthSigninDTO } from './dto/oauth.signin.dto';
import { OAuthSignupDTO } from './dto/oauth.signup.dto';
import { Timestamp } from 'firebase-admin/firestore';
import { Role } from 'src/user-management/utils/helper';
import { OAuthVO } from '../vo/auth.oauth.vo';

/**
 * A generic validation pipe that:
 * 1) Converts plain JS objects into an instance of a given DTO class
 * 2) Runs class-validator on that instance
 * 3) Throws BadRequestException if validation fails
 */
@Injectable()
export class AuthValidationPipe implements PipeTransform {
  constructor(
    private readonly dtoClass: any, // AuthSigninDTO | AuthSignupDTO | AuthUpdateDTO | OAuthSigninDTO | OAuthSignupDTO,
    private readonly origin: 'local-signup' | 'local-signin' | 'update' | 'oauth-signup' | 'oauth-signin',
  ) { }

  async transform(value: any, metadata: ArgumentMetadata) {
    // checking if value if empty
    if (!value || Object.keys(value).length === 0) {
      // If the value is empty, throw a BadRequestException
      throw new BadRequestException('Request body cannot be empty');
    }

    // Convert plain object to an instance of the specified DTO class
    const dtoInstance = plainToInstance(this.dtoClass, value);

    // Perform validation
    const errors = await validate(dtoInstance, {
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown properties are present
    });

    if (errors.length > 0) {
      // You could customize error messages further if desired
      throw new BadRequestException(errors);
    }

    // Convert DTO to VO
    let voInstance = null;

    // Depending on the origin, create an instance of the appropriate VO
    switch (this.origin) {
      case 'local-signup':
        voInstance = new LocalAuthVO(
          "",
          (value as AuthSignupDTO).email,
          (value as AuthSignupDTO).password,
          undefined,
          Timestamp.now().toDate(),
          Timestamp.now().toDate(),
          Timestamp.now().toDate(),
          0
        );
        break;
      case 'local-signin':
        voInstance = new LocalAuthVO(
          undefined,
          (value as AuthSignupDTO).email,
          (value as AuthSignupDTO).password,
          undefined,
        );
        break;
      case 'update':
        voInstance = new LocalAuthVO(
          "",
          (value as AuthSignupDTO).email,
          (value as AuthSignupDTO).password,
          undefined,
          undefined,
          Timestamp.now().toDate(),
        );
        break;
      case 'oauth-signup':
        voInstance = new OAuthVO(
          undefined,
          (value as OAuthSignupDTO).provider,
          (value as OAuthSignupDTO).accessToken,
          (value as OAuthSignupDTO).email,
          undefined,
          undefined,
          Timestamp.now().toDate(),
          Timestamp.now().toDate(),
          Timestamp.now().toDate(),
        )
        break;
      case 'oauth-signin':
        voInstance = new OAuthVO(
          undefined,
          (value as OAuthSigninDTO).provider,
          (value as OAuthSigninDTO).accessToken,
          (value as OAuthSigninDTO).email,
          undefined,
          undefined,
          undefined,
          undefined,
          Timestamp.now().toDate(),
        );
        break;
      default:
        throw new BadRequestException('Invalid origin type');
    }

        // Return the validated & transformed DTO
        return voInstance;
    }
  }
