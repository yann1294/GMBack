import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { LocalAuthVO } from '../vo/auth.local.vo';
import IAuthDAO from '../dao/auth.dao.interface';
import { auth } from 'firebase-admin';
import { IRole } from '../types/role.types';
import { DataService } from 'src/shared/services/data.service';

@Injectable()
export class AuthService implements IAuthService {
  // Adjust salt rounds or fetch them from config.
  private readonly saltRounds = 10;
  constructor(
    @Inject('IAuthDAO') private readonly authDAO: IAuthDAO,
    private readonly jwtService: JwtService,
    private readonly dataService: DataService,
  ) {}

  async generateUid(): Promise<string> {
    return this.authDAO.generateNewAuthUID();
  }

  /**
   * Registers a new local user (email/password).
   * - Could hash the password
   * - Calls DAO to store a LocalAuthEntity
   */
  async registerLocalUser(userVo: LocalAuthVO): Promise<LocalAuthEntity> {
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
      undefined,
      {
        firstName: userVo.firstName,
        lastName: userVo.lastName,
        phoneNumber: userVo.phoneNumber,
        profilePhoto: userVo.profilePhoto,
        identificationFile: userVo.identificationFile,
        identificationType: userVo.identificationType,
        spokenLanguages: userVo.spokenLanguages,
        availability: userVo.availability,
      },
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
      return localEntity;
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
  ): Promise<LocalAuthEntity> {
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
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { sub: user.uId },
      { expiresIn: '7d' },
    );

    // Store refresh token in DB
    await this.authDAO.storeRefreshToken(user.uId, accessToken);

    // Create Firebase custom token for client-side auth
    const firebaseToken = await this.authDAO.createCustomToken(user.uId);

    const freshUser = await this.authDAO.findLocalAuthByUID(user.uId);
    if (!freshUser)
      throw new InternalServerErrorException('User disappeared after signin');

    freshUser.tokens = {
      accessToken,
      refreshToken,
      firebaseToken,
    };

    return freshUser;
  }

  /**
   * Registers a new OAuth user.
   * - In real usage, you'd verify the accessToken with the social provider first
   * - Then store OAuthEntity
   */

  /**
   * Issue your own JWT + refresh, plus a Firebase ID token for client‑side auth
   */
  private async generateTokensForOAuth(
    uid: string,
    role?: IRole,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    firebaseToken: string;
  }> {
    // 1) Create your application JWT
    const payload = { sub: uid, role };
    const accessToken = this.jwtService.sign(payload);

    // 2) Create a long‑lived refresh token
    const refreshToken = this.jwtService.sign(
      { sub: uid },
      { expiresIn: '7d' },
    );

    // 3) Persist the refresh token (so you can revoke/rotate later)
    await this.authDAO.storeRefreshToken(uid, accessToken);

    // 4) Create a Firebase ID token for client‑side signInWithCustomToken()
    //    DataService.generateIdToken wraps createCustomToken + signInWithCustomToken
    const firebaseToken = await this.dataService.generateIdToken(uid);

    return { accessToken, refreshToken, firebaseToken };
  }
  async registerOAuthUser(
    idToken: any,
    provider: string,
    role?: IRole,
  ): Promise<OAuthEntity> {
    const decodedToken = await this.verifyIdToken(idToken);
    if (!decodedToken.email) throw new UnauthorizedException('Invalid token');

    const existingUser = await this.authDAO.findOAuthByEmail(
      decodedToken.email,
    );
    if (existingUser) {
      const tok = await this.generateTokensForOAuth(
        existingUser.uId,
        existingUser.role,
      );
      existingUser.tokens = {
        accessToken: tok.accessToken,
        refreshToken: tok.refreshToken,
      };
      return existingUser;
    }

    const oauthEntity = new OAuthEntity(
      decodedToken.uId,
      decodedToken.emailAddress,
      provider,
      undefined,
      role,
      new Date(),
      new Date(),
      new Date(),
    );

    await this.authDAO.createOAuthAuth(oauthEntity);

    if (role) {
      await this.authDAO.setCustomUserClaims(decodedToken.uId, { role });
    }

    const tokens = await this.generateTokensForOAuth(decodedToken.uid, role);
    oauthEntity.tokens = tokens;

    return oauthEntity;
  }

  /**
   * 1) Verify the provider’s ID token
   * 2) Fetch the user from Firestore by UID
   * 3) Issue fresh tokens
   * 4) Attach them and return the entity
   */
  async loginOAuthUser(
    idToken: string,
    provider: string,
  ): Promise<OAuthEntity> {
    // a) verify with Firebase Admin
    const decoded = await this.dataService.verifyIdToken(idToken);
    if (!decoded.uid || decoded.firebase === undefined) {
      throw new UnauthorizedException('Invalid OAuth token');
    }

    // b) lookup by the verified UID
    const user = await this.authDAO.findOAuthByUID(decoded.uid);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.provider !== provider) {
      throw new UnauthorizedException('Provider mismatch');
    }

    // c) generate and attach tokens
    const { accessToken, refreshToken } = await this.generateTokensForOAuth(
      user.uId,
      user.role,
    );

    user.tokens = {
      accessToken,
      refreshToken,
    };

    return user;
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

  // Add this method to the AuthService class
  async signOut(uid: string): Promise<void> {
    await this.authDAO.revokeRefreshTokens(uid);
  }

  async updateLocalAuth(
    uid: string,
    updateVO: LocalAuthVO,
  ): Promise<LocalAuthEntity> {
    // 1. Get existing user data
    const existingEntity = await this.authDAO.findLocalAuthByUID(uid);
    if (!existingEntity) {
      throw new NotFoundException('User not found');
    }

    // 2. Prepare updates
    const updates: Partial<LocalAuthEntity> = {};
    let newPassword: string | undefined;

    // Handle email update
    if (
      updateVO.emailAddress &&
      updateVO.emailAddress !== existingEntity.emailAddress
    ) {
      const emailExists = await this.authDAO.getUserByEmail(
        updateVO.emailAddress,
      );
      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
      updates.emailAddress = updateVO.emailAddress;
    }

    // Handle password update
    if (updateVO.password) {
      const isSamePassword = await bcrypt.compare(
        updateVO.password,
        existingEntity.password,
      );
      if (!isSamePassword) {
        const hashedPassword = await bcrypt.hash(
          updateVO.password,
          this.saltRounds,
        );
        updates.password = hashedPassword;
        newPassword = updateVO.password; // Plaintext for Firebase Auth
      }
    }

    // Handle other fields
    if (updateVO.lastLoginDate !== undefined) {
      updates.lastLoginDate = updateVO.lastLoginDate;
    }

    if (updateVO.failedLoginAttempts !== undefined) {
      updates.failedLoginAttempts = updateVO.failedLoginAttempts;
    }

    // 3. Create updated entity
    const updatedEntity = new LocalAuthEntity(
      uid,
      updates.emailAddress || existingEntity.emailAddress,
      updates.password || existingEntity.password,
      existingEntity.role,
      existingEntity.createdAt,
      new Date(), // Update the updatedAt timestamp
      updates.lastLoginDate || existingEntity.lastLoginDate,
      updates.failedLoginAttempts || existingEntity.failedLoginAttempts,
    );

    // 4. Perform the update through DAO
    const result = await this.authDAO.updateLocalAuth(
      updatedEntity,
      newPassword,
    );

    if (result.status !== 'success') {
      throw new InternalServerErrorException(result.message);
    }

    // 5. Return the updated entity
    const freshEntity = await this.authDAO.findLocalAuthByUID(uid);
    if (!freshEntity) {
      throw new NotFoundException('User data not available after update');
    }

    return freshEntity;
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

  // auth.service.ts

  async generateIdToken(
    uid: string,
    claims?: Record<string, any>,
  ): Promise<string> {
    return this.authDAO.generateIdToken(uid, claims);
  }

  async getUser(uid: string): Promise<auth.UserRecord> {
    return this.authDAO.getUser(uid);
  }

  async createUser(properties: auth.CreateRequest): Promise<auth.UserRecord> {
    return this.authDAO.createUser(properties);
  }
}
