import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { AuthDAO } from '../dao/auth.dao';
import IAuthService from './auth.service.interface';
import { Role } from '../utils/helper';
import { ResponseObject } from '../../shared/types';
import { LocalAuthEntity } from '../dao/localauth.entity';
import { OAuthEntity } from '../dao/oauth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
  // Adjust salt rounds or fetch them from config.
  private readonly saltRounds = 10;
  constructor(
    private readonly authDAO: AuthDAO,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new local user (email/password).
   * - Could hash the password
   * - Calls DAO to store a LocalAuthEntity
   */
  async registerLocalUser(
    userName: string,
    email: string,
    password: string,
    role: Role,
  ): Promise<ResponseObject> {
    // Example: hash the password before storing it
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Generate a Firestore doc ID to use as our user UID
    const generatedUid = this.authDAO.generateNewAuthUID();

    // Construct a LocalAuthEntity
    const localEntity = new LocalAuthEntity(
      /* uid */ generatedUid, // e.g. from a UUID library or DataService
      userName,
      email,
      /* password */ hashedPassword,
      role,
      /* createdAt */ new Date(),
      /* updatedAt */ new Date(),
    );

    // Persist to Firestore
    const creationResult = await this.authDAO.createLocalAuth(localEntity);

    return creationResult;
  }

  /**
   * Logs in a local user by verifying their credentials.
   * - Finds user in DB
   * - Verifies password with bcrypt.compare
   * - If valid, issues a JWT
   * - Returns the user (or user + JWT) depending on your design
   */
  async loginLocalUser(
    userName: string,
    password: string,
  ): Promise<{ user: LocalAuthEntity; token: string }> {
    // Find user by userName
    const user = await this.authDAO.findLocalAuthByUserName(userName);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Build JWT payload
    const payload = {
      sub: user.uid,
      role: user.role,
      userName: user.userName,
    };

    // Sign token
    const token = this.jwtService.sign(payload);

    // Return both user and token.
    // Alternatively, you might return just the token or wrap them in a ResponseObject.
    return { user, token };
  }

  /**
   * Registers a new OAuth user.
   * - In real usage, you'd verify the accessToken with the social provider first
   * - Then store OAuthEntity
   */
  async registerOAuthUser(
    email: string,
    provider: string,
    accessToken: string,
    role?: Role,
  ): Promise<ResponseObject> {
    const realUid = this.authDAO.generateNewAuthUID();

    const oauthEntity = new OAuthEntity(
      realUid,
      email,
      provider,
      accessToken,
      /* refreshToken */ undefined,
      role,
      new Date(), // createdAt
      new Date(), // updatedAt
    );

    const creationResult = await this.authDAO.createOAuthAuth(oauthEntity);
    return creationResult;
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
      sub: user.uid,
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

  // /**
  //  * Generates a user ID if needed.
  //  * Could also rely on Firestore doc ID or a UUID library.
  //  */
  // private generateUID(): string {
  //   return Math.random().toString(36).slice(2, 11);
  // }
}
