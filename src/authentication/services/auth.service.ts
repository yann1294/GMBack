import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDAO } from '../dao/auth.dao';
import IAuthService from './auth.service.interface';
// import { Role } from '../utils/helper';
import { ResponseObject } from '../../shared/types';
import { LocalAuthEntity } from '../dao/localauth.entity';
import { OAuthEntity } from '../dao/oauth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../utils/helper';
import { LocalAuthVO } from '../vo/auth.local.vo';
import IAuthDAO from '../dao/auth.dao.interface';
import { auth } from 'firebase-admin';
import { AuthResponseDTO } from '../controller/dto/auth.response.dto';
import { IRole } from '../types/role.types';

@Injectable()
export class AuthService implements IAuthService {
  // Adjust salt rounds or fetch them from config.
  private readonly saltRounds = 10;
  constructor(
    @Inject('IAuthDAO') private readonly authDAO: IAuthDAO,
    private readonly jwtService: JwtService,
  ) {}

  async generateUid(): Promise<string> {
    return this.authDAO.generateNewAuthUID();
  }

  /**
   * Registers a new local user (email/password).
   * - Could hash the password
   * - Calls DAO to store a LocalAuthEntity
   */
  async registerLocalUser(userVo: LocalAuthVO): Promise<ResponseObject> {
    // Ensure role exists
    const role = userVo.role || { name: 'tourist' };
    const hashedPassword = await bcrypt.hash(userVo.password, this.saltRounds);
    //const generatedUid = await this.authDAO.generateNewAuthUID();

    const localEntity = new LocalAuthEntity(
      userVo.uId,
      userVo.emailAddress,
      hashedPassword,
      role,
      userVo.createdAt,
      userVo.updatedAt,
      userVo.lastLoginDate,
      userVo.failedLoginAttempts,
    );
    console.log('Registering with UID:', userVo.uId);
    console.log('Registering user with email:', userVo.emailAddress);
    // Create Firebase Auth user first
    try {
      await this.authDAO.createLocalAuth(localEntity, userVo.password);

      // Optionally set custom claims
      if (userVo.role) {
        await this.authDAO.setCustomUserClaims(userVo.uId, {
          role: userVo.role,
        });
      }

      return {
        status: 'success',
        code: 201,
        message: 'User registered successfully',
        data: { uid: userVo.uId },
      };
    } catch (error) {
      // Clean up if Firebase Auth fails
      await this.authDAO.deleteAuth(userVo.uId);
      throw error;
    }
  }

  /**
   * Logs in a local user by verifying their credentials.
   * - Finds user in DB
   * - Verifies password with bcrypt.compare
   * - If valid, issues a JWT
   * - Returns the user (or user + JWT) depending on your design
   */
  async loginLocalUser(
    email: string,
    password: string,
  ): Promise<{ user: LocalAuthEntity; token: string; firebaseToken?: string }> {
    const user = await this.authDAO.findLocalAuthByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Create JWT token
    const payload = {
      sub: user.uId,
      role: user.role,
      email: user.emailAddress,
    };
    const token = this.jwtService.sign(payload);

    // Create Firebase custom token for client-side auth
    const firebaseToken = await this.authDAO.createCustomToken(user.uId);

    return { user, token, firebaseToken };
  }

  /**
   * Registers a new OAuth user.
   * - In real usage, you'd verify the accessToken with the social provider first
   * - Then store OAuthEntity
   */
  async registerOAuthUser(
    idToken: string,
    provider: string,
    role?: IRole,
  ): Promise<ResponseObject> {
    const decodedToken = await this.verifyIdToken(idToken);
    if (!decodedToken.email) throw new UnauthorizedException('Invalid token');

    const existingUser = await this.authDAO.findOAuthByEmail(
      decodedToken.email,
    );
    if (existingUser) {
      return {
        status: 'success',
        code: 201,
        message: 'User already exists',
        data: { uid: existingUser.uId },
      };
    }

    const oauthEntity = new OAuthEntity(
      decodedToken.uId,
      decodedToken.email,
      provider,
      idToken,
      undefined, // refreshToken
      role,
      new Date(),
      new Date(),
    );

    await this.authDAO.createOAuthAuth(oauthEntity);

    if (role) {
      await this.authDAO.setCustomUserClaims(decodedToken.uId, { role });
    }

    return {
      status: 'success',
      code: 201,
      message: 'OAuth user registered',
      data: { uid: decodedToken.uid },
    };
  }

  /**
   * Logs in an OAuth user.
   * - Typically checks if user with UID and provider exists
   * - Possibly verifies the token with the provider
   * - Issues a JWT
   */
  async loginOAuthUser(
    provider: string,
    uid: string,
  ): Promise<{ user: OAuthEntity; token: string }> {
    // Find user by UID
    const user = await this.authDAO.findOAuthByUID(uid);
    if (!user || user.provider !== provider) {
      throw new UnauthorizedException('User not found or provider mismatch');
    }

    // Build JWT payload
    const payload = {
      sub: user.uId,
      role: user.role,
      provider: user.provider,
    };

    // Issue a JWT
    const token = this.jwtService.sign(payload);

    return { user, token };
  }

  /**
   * Finds any user (local or oauth) by UID.
   */
  async findUserByUID(
    uid: string,
  ): Promise<LocalAuthEntity | OAuthEntity | null> {
    const localUser = await this.authDAO.findLocalAuthByUID(uid);
    if (localUser) {
      return localUser;
    }

    const oauthUser = await this.authDAO.findOAuthByUID(uid);
    if (oauthUser) {
      return oauthUser;
    }

    return null;
  }

  /**
   * Firebase Auth specific methods
   */

  async verifyIdToken(idToken: string): Promise<auth.DecodedIdToken> {
    return this.authDAO.verifyIdToken(idToken);
  }

  async setCustomUserClaims(
    uid: string,
    claims: Record<string, any>,
  ): Promise<void> {
    return this.authDAO.setCustomUserClaims(uid, claims);
  }

  async getUserByEmail(email: string): Promise<auth.UserRecord | null> {
    try {
      return await this.authDAO.getUserByEmail(email);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      throw error;
    }
  }

  async createCustomToken(
    uid: string,
    developerClaims?: Record<string, any>,
  ): Promise<string> {
    try {
      const customToken = await this.authDAO.createCustomToken(
        uid,
        developerClaims,
      );
      return customToken;
    } catch (error) {
      throw new Error(`Error creating custom token: ${error}`);
    }
  }

  /**
   * Exchanges a Firebase refresh token for a new ID token.
   * This uses the Firebase securetoken endpoint.
   * @param refreshToken - The refresh token provided by Firebase.
   * @returns A Promise that resolves to an object with the new ID token.
   */
  async refreshToken(
    refreshToken: string,
  ): Promise<{ token: string; firebaseToken?: string }> {
    try {
      // 1. Verify the refresh token (implementation depends on how you store/issue refresh tokens)
      const decoded = await this.verifyRefreshToken(refreshToken);

      // 2. Get the user
      const user = await this.findUserByUID(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // 3. Generate new access token
      const payload = {
        sub: user.uId,
        role: user.role,
        email: user.emailAddress || undefined,
        provider: user instanceof OAuthEntity ? user.provider : undefined,
      };

      const newAccessToken = this.jwtService.sign(payload);

      // 4. Optionally generate new Firebase token
      let newFirebaseToken: string | undefined;
      if (this.shouldRefreshFirebaseToken(decoded)) {
        newFirebaseToken = await this.createCustomToken(user.uId);
      }

      return {
        token: newAccessToken,
        firebaseToken: newFirebaseToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Helper method to verify your refresh token
  private async verifyRefreshToken(token: string): Promise<{ sub: string }> {
    // Implementation depends on how you store/issue refresh tokens
    // Example 1: If using JWT for refresh tokens:
    try {
      return this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Example 2: If storing in database:
    // const storedToken = await this.tokenRepository.findOne({ where: { token } });
    // if (!storedToken || storedToken.expiresAt < new Date()) {
    //     throw new UnauthorizedException('Invalid refresh token');
    // }
    // return { sub: storedToken.userId };
  }

  // Helper to determine if Firebase token should be refreshed
  private shouldRefreshFirebaseToken(decoded: any): boolean {
    // Refresh Firebase token if it's about to expire or based on other logic
    // Example: Check the 'exp' claim if present
    if (decoded.exp) {
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;
      return expiresIn < 3600; // Refresh if expires in less than 1 hour
    }
    return false;
  }
}
