import {
  Body,
  Controller,
  Post,
  Patch,
  UsePipes,
  Param,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthValidationPipe } from './auth.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../utils/firebase-auth.guard';

// DTOs

import { AuthResponseDTO } from './dto/auth.response.dto';
import { AuthSignupDTO } from './dto/auth.signup.dto';
import { AuthSigninDTO } from './dto/auth.signin.dto';
import { OAuthSignupDTO } from './dto/oauth.signup.dto';
import { OAuthSigninDTO } from './dto/oauth.signin.dto';
// VO

// Types

import { DecodedIdToken } from 'firebase-admin/auth';
import { LocalAuthVO } from '../vo/auth.local.vo';
import { CurrentUser } from "../utils/ current-user.decorator.ts\nimport { createParamDecorator, ExecutionContext } from '@nestjs/common';\n\nexport const CurrentUser = createParamDecorator(\n  (data: unknown, ctx: ExecutionContext) => {\n    const request = ctx.switchToHttp().getRequest();\n    return request.user;\n  }\n/ current-user.decorator.ts\nimport { createParamDecorator, ExecutionContext } from '@nestjs/current-user.decorator";
import { Role } from '../utils/helper';
import { IsUUID } from 'class-validator';
import { AuthMapper } from './auth.mapper';
import { IRole } from '../types/role.types';
import { DataService } from 'src/shared/services/data.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly dataService: DataService,
  ) {}

  private readonly validRoles = ['admin', 'tourist', 'guide'];

  private validateRole(role: IRole): void {
    // Get role name whether it's string or IRole object

    if (!this.validRoles.includes(role.name)) {
      throw new UnprocessableEntityException(
        `Invalid role. Valid roles are: ${this.validRoles.join(', ')}`,
      );
    }
  }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async localSignup(
    @Body(new AuthValidationPipe(AuthSignupDTO, 'local-signup'))
    body: AuthSignupDTO,
  ): Promise<AuthResponseDTO> {
    // Generate a UID for the new user
    const uid = await this.authService.generateUid();
    console.log('Generated UID:', uid);

    // Create a proper LocalAuthVO instance
    const localAuthVO = new LocalAuthVO(
      uid,
      body.emailAddress,
      body.password,
      body.role ? body.role : { name: 'tourist' }, // Default role if not provided
      new Date(), // createdAt
      new Date(), // updatedAt
      undefined, // lastLoginDate
      0, // failedLoginAttempts
    );

    // Validate the role if provided
    // if (body.role) {
    //   this.validateRole(body.role);
    // }

    const result = await this.authService.registerLocalUser(localAuthVO);
    return AuthMapper.toResponse(result);
  }

  @Post('local/:role/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate local user' })
  @ApiParam({ name: 'role', enum: ['admin', 'tourist', 'guide'] })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDTO,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 422, description: 'Role mismatch' })
  async localSignin(
    @Param('role') role: IRole,
    @Body(new AuthValidationPipe(AuthSigninDTO, 'local-signin'))
    body: LocalAuthVO,
  ): Promise<AuthResponseDTO> {
    this.validateRole(role);

    const authResult = await this.authService.loginLocalUser(
      body.emailAddress,
      body.password,
    );

    if (authResult.user.role !== role) {
      throw new UnprocessableEntityException(
        `User is not registered as ${role}`,
      );
    }

    return this.mapToAuthResponse(authResult);
  }

  // @Patch('me')
  // @UseGuards(FirebaseAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Update authenticated user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Update successful',
  //   type: AuthResponseDTO,
  // })
  // async updateLocal(
  //   @CurrentUser() user: DecodedIdToken,
  //   @Body(new AuthValidationPipe(AuthUpdateDTO, 'update')) body: LocalAuthVO,
  // ): Promise<AuthResponseDTO> {
  //   const result = await this.authService.updateLocalAuth(user.uid, body);
  //   return this.mapToAuthResponse(result);
  // }

  @Post('oauth/signup')
  @UsePipes(new AuthValidationPipe(OAuthSignupDTO, 'oauth-signup'))
  @ApiOperation({ summary: 'Register new OAuth user' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: AuthResponseDTO,
  })
  async oauthSignup(@Body() body: OAuthSignupDTO): Promise<AuthResponseDTO> {
    const result = await this.authService.registerOAuthUser(
      body.accessToken,
      body.provider,
    );
    return this.mapToAuthResponse(result);
  }

  @Post('oauth/signin')
  @UsePipes(new AuthValidationPipe(OAuthSigninDTO, 'oauth-signin'))
  @ApiOperation({ summary: 'Authenticate OAuth user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDTO,
  })
  async oauthSignin(@Body() body: OAuthSigninDTO): Promise<AuthResponseDTO> {
    const authResult = await this.authService.loginOAuthUser(
      body.provider,
      body.accessToken,
    );
    return this.mapToAuthResponse(authResult);
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'User info', type: AuthResponseDTO })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getCurrentUser(
    @CurrentUser() user: DecodedIdToken,
  ): Promise<AuthResponseDTO> {
    const userData = await this.authService.findUserByUID(user.uid);
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    return AuthMapper.toResponse(userData);
  }

  private mapToAuthResponse(result: any): AuthResponseDTO {
    const isLocalAuth =
      'emailAddress' in result.user || 'emailAddress' in result;
    const emailAddress = isLocalAuth
      ? result.user?.emailAddress || result.emailAddress
      : result.user?.email || result.email;

    return {
      uid: result.user?.uid || result.uid,
      emailAddress: result.user?.emailAddress || result.emailAddress,
      role: result.user?.role?.name || result.role?.name,
      provider: result.user?.provider || result.provider,
      tokens: {
        accessToken: result.token,
        refreshToken: result.refreshToken,
      },
      metadata: {
        createdAt: result.user?.createdAt || result.createdAt,
      },
      authType: result.user?.authType || result.authType,
    };
  }
}
