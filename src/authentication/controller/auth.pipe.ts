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
import { Role } from '../utils/helper';
import { OAuthVO } from '../vo/auth.oauth.vo';
import { auth } from 'firebase-admin';

@Injectable()
export class AuthValidationPipe<T> implements PipeTransform {
  constructor(
    private readonly dtoClass: new () => T,
    private readonly origin:
      | 'local-signup'
      | 'local-signin'
      | 'update'
      | 'oauth-signup'
      | 'oauth-signin',
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // Add Firebase ID token verification for OAuth flows
    if (this.origin.startsWith('oauth')) {
      await this.verifyOAuthToken(value);
    }

    const dtoInstance = plainToInstance(this.dtoClass, value);
    const errors = await validate(dtoInstance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }

    return this.createVOInstance(dtoInstance as T);
  }

  private async verifyOAuthToken(value: any) {
    try {
      const token = value.accessToken;
      if (!token) throw new BadRequestException('Missing access token');

      const decoded = await auth().verifyIdToken(token);
      value.uid = decoded.uid; // Add verified UID to request
      value.email = decoded.email || value.email; // Prefer verified email
    } catch (error) {
      throw new BadRequestException('Invalid or expired access token');
    }
  }

  private formatErrors(errors: any[]) {
    return errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
    }));
  }

  private createVOInstance(dto: T) {
    const now = Timestamp.now().toDate();

    const voFactory = {
      'local-signup': () =>
        new LocalAuthVO(
          undefined, // Will be generated later
          (dto as AuthSignupDTO).email,
          (dto as AuthSignupDTO).password,
          (dto as AuthSignupDTO).role || { name: 'tourist' },
          now,
          now,
          now,
          0,
        ),
      'local-signin': () =>
        new LocalAuthVO(
          undefined,
          (dto as AuthSigninDTO).email,
          (dto as AuthSigninDTO).password,
        ),
      update: () =>
        new LocalAuthVO(
          undefined, // Will be populated from auth context
          (dto as AuthUpdateDTO).email,
          (dto as AuthUpdateDTO).password,
          undefined,
          undefined,
          now,
        ),
      'oauth-signup': () =>
        new OAuthVO(
          (dto as any).uid, // From verified token
          (dto as OAuthSignupDTO).provider,
          (dto as OAuthSignupDTO).accessToken,
          (dto as any).email, // From verified token
          undefined,
          (dto as OAuthSignupDTO).role,
          now,
          now,
          now,
        ),
      'oauth-signin': () =>
        new OAuthVO(
          (dto as any).uid, // From verified token
          (dto as OAuthSigninDTO).provider,
          (dto as OAuthSigninDTO).accessToken,
          (dto as any).email, // From verified token
          undefined,
          undefined,
          undefined,
          undefined,
          now,
        ),
    };

    return voFactory[this.origin]();
  }
}
