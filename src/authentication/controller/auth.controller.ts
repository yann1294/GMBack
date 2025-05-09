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
  ForbiddenException,
  Req,
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

import { Auth, DecodedIdToken } from 'firebase-admin/auth';
import { LocalAuthVO } from '../vo/auth.local.vo';
import { CurrentUser } from "../utils/ current-user.decorator.ts\nimport { createParamDecorator, ExecutionContext } from '@nestjs/common';\n\nexport const CurrentUser = createParamDecorator(\n  (data: unknown, ctx: ExecutionContext) => {\n    const request = ctx.switchToHttp().getRequest();\n    return request.user;\n  }\n/ current-user.decorator.ts\nimport { createParamDecorator, ExecutionContext } from '@nestjs/current-user.decorator";
import { Role } from '../utils/helper';
import { IsUUID } from 'class-validator';
import { AuthMapper } from './auth.mapper';
import { IRole } from '../types/role.types';
import { DataService } from 'src/shared/services/data.service';
import {
  TestTokenRequestDTO,
  TestTokenResponseDTO,
} from './dto/test-token.dto';
import { auth } from 'firebase-admin';
import { AuthUpdateDTO } from './dto/auth.update.dto';

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
      undefined,
      body.firstName,
      body.lastName,
      body.phoneNumber,
      body.profilePhoto,
      body.identificationFile,
      body.identificationType,
      body.spokenLanguages,
      body.availability,
    );

    const result = await this.authService.registerLocalUser(localAuthVO);
    return AuthMapper.toResponse(result);
  }

  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate local user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDTO,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async localSignin(
    @Body(new AuthValidationPipe(AuthSigninDTO, 'local-signin'))
    dto: AuthSigninDTO,
  ): Promise<AuthResponseDTO> {
    const authResult = await this.authService.loginLocalUser(
      dto.emailAddress,
      dto.password,
    );

    return AuthMapper.toResponse(authResult);
  }

  @Patch('me')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Update successful',
    type: AuthResponseDTO,
  })
  async updateLocal(
    @CurrentUser() user: DecodedIdToken,
    @Body(new AuthValidationPipe(AuthUpdateDTO, 'update')) dto: AuthUpdateDTO,
  ): Promise<AuthResponseDTO> {
    // now map DTO → VO yourself:
    const updateVO = new LocalAuthVO(
      user.uid,
      dto.emailAddress,
      dto.password,
      undefined, // role isn’t updatable here
      undefined, // createdAt stays untouched
      new Date(), // updatedAt
      dto.lastLoginDate ? new Date(dto.lastLoginDate) : undefined,
      dto.failedLoginAttempts,
    );
    const result = await this.authService.updateLocalAuth(user.uid, updateVO);
    return AuthMapper.toResponse(result);
  }

  @Post('local/signout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: 'Sign out user' })
  @ApiResponse({ status: 200, description: 'Successfully signed out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async localSignout(
    @Req() req: { user: { uid: string }; authType: string },
  ): Promise<{ message: string }> {
    // Revoke Firebase tokens regardless of auth type
    await this.authService.signOut(req.user.uid);

    return { message: 'Successfully signed out' };
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
    console.log('Current user UID:', user.uid);

    const userData = await this.authService.findUserByUID(user.uid);
    console.log('Found user data:', userData);
    if (!userData) {
      console.error(`User ${user.uid} not found in database`);
      throw new NotFoundException('User not found');
    }
    return AuthMapper.toResponse(userData);
  }

  @Post('oauth/signup')
  @ApiOperation({ summary: 'Register new OAuth user' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: AuthResponseDTO,
  })
  async oauthSignup(@Body() dto: OAuthSignupDTO): Promise<AuthResponseDTO> {
    const result = await this.authService.registerOAuthUser(
      dto.accessToken,
      dto.provider,
    );
    return AuthMapper.toResponse(result);
  }

  @Post('oauth/signin')
  @ApiOperation({ summary: 'Authenticate OAuth user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDTO,
  })
  async oauthSignin(@Body() dto: OAuthSigninDTO): Promise<AuthResponseDTO> {
    const authResult = await this.authService.loginOAuthUser(
      dto.accessToken,
      dto.provider,
    );
    return AuthMapper.toResponse(authResult);
  }

  /** POST /auth/test-token */
  @Post('test-token')
  @HttpCode(HttpStatus.OK)
  async generateTestToken(
    @Body() dto: TestTokenRequestDTO,
  ): Promise<TestTokenResponseDTO> {
    // If they passed email instead of uid, look up the UID
    let uid = dto.uid;
    if (!uid && dto.email) {
      const userRecord = await this.dataService.getUserByEmail(dto.email);
      uid = userRecord.uid;
    }

    const token = await this.dataService.generateIdToken(uid, dto.claims);
    return { token };
  }
}
