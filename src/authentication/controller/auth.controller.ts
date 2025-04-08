// auth.controller.ts
import {
  Body,
  Controller,
  Post,
  Patch,
  UsePipes,
  Param,
  Get,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

// DTOs
import { AuthSignupDTO } from './dto/auth.signup.dto';
import { AuthSigninDTO } from './dto/auth.signin.dto';
import { AuthUpdateDTO } from './dto/auth.update.dto';
import { OAuthSignupDTO } from './dto/oauth.signup.dto';
import { OAuthSigninDTO } from './dto/oauth.signin.dto';

// Validation Pipe
import { AuthValidationPipe } from './auth.pipe';

/**
 * Example Authentication Controller
 * - Local signup/signin
 * - OAuth signup/signin
 * - Update local auth data
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * LOCAL SIGNUP
   * Validates input using AuthSignupDTO (email + password).
   */
  @Post('local/signup')
  @UsePipes(new AuthValidationPipe(AuthSignupDTO))
  async localSignup(@Body() body: AuthSignupDTO) {
    // The AuthSignupDTO ensures we have a valid email & password
    return this.authService.registerLocalUser(
      // If your service also requires userName, adapt accordingly
      // For example, if you want to treat 'email' as userName or pass an empty string
      body.username,
      body.email,
      body.password,
      body.role,
      // Provide a default role or retrieve it from somewhere
      // e.g. Role.USER, or body.role if you have that
    );
  }

  /**
   * LOCAL SIGNIN
   * Validates input using AuthSigninDTO (email + password).
   * Returns { user: LocalAuthEntity, token: string } from service.
   */
  @Post('local/signin')
  @UsePipes(new AuthValidationPipe(AuthSigninDTO))
  async localSignin(@Body() body: AuthSigninDTO) {
    // The AuthSigninDTO ensures we have a valid email & password
    return this.authService.loginLocalUser(
      // If your service expects userName, adapt accordingly.
      // Otherwise, if it expects email, pass 'body.email'
      body.email,
      body.password,
    );
  }

  /**
   * UPDATE LOCAL AUTH
   * For example, patching a user's email, password, etc.
   * AuthUpdateDTO has optional fields, so partial updates are allowed.
   */
  @Patch('local/update/:uid')
  @UsePipes(new AuthValidationPipe(AuthUpdateDTO))
  async updateLocal(@Param('uid') uid: string, @Body() body: AuthUpdateDTO) {
    // You might call a service method like this:
    // return this.authService.updateLocalUser(uid, body);
    // Then handle the logic to map AuthUpdateDTO -> an entity or partial update.
    return `Pretending to update user ${uid} with: ${JSON.stringify(body)}`;
  }

  /**
   * OAUTH SIGNUP
   * Validates input using OAuthSignupDTO (provider, accessToken, userName optional).
   */
  @Post('oauth/signup')
  @UsePipes(new AuthValidationPipe(OAuthSignupDTO))
  async oauthSignup(@Body() body: OAuthSignupDTO) {
    return this.authService.registerOAuthUser(
      // If your service code always generates the UID internally, you can pass anything or empty:
      body.email ?? '',
      body.provider,
      body.accessToken,
      // Optionally pass body.userName or a default role
    );
  }

  /**
   * OAUTH SIGNIN
   * Validates input using OAuthSigninDTO (provider, accessToken).
   */
  @Post('oauth/signin')
  @UsePipes(new AuthValidationPipe(OAuthSigninDTO))
  async oauthSignin(@Body() body: OAuthSigninDTO) {
    // For an OAuth login, you might do:
    return this.authService.loginOAuthUser(body.provider, body.accessToken);
  }

  /**
   * OPTIONAL: An example endpoint to fetch user data by UID (local or oauth).
   * Could return an AuthResponseDTO or the entity itself.
   */
  @Get(':uid')
  async findAuthByUID(@Param('uid') uid: string) {
    const user = await this.authService.findUserByUID(uid);
    if (!user) {
      return { message: 'Not found' };
    }
    return user; // or map to AuthResponseDTO if you want consistent response fields
  }
}
