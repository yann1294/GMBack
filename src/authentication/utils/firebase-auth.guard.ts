import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataService } from 'src/shared/services/data.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly dataService: DataService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token required');
    }

    try {
      return await this.verifyToken(token, request);
    } catch (error) {
      this.logError(error, token);
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private async verifyToken(token: string, request: any): Promise<boolean> {
    // 1) Try your own JWT
    try {
      const payload = this.jwtService.verify(token);
      if (!payload.sub) throw new Error('JWT missing subject');
      request.user = { uid: payload.sub, ...payload };
      request.authType = 'jwt';
      return true;
    } catch (jwtErr) {
      // 2) Fallback to Firebase ID token
      try {
        const decoded = await this.dataService.verifyIdToken(token);
        request.user = { uid: decoded.uid, ...decoded };
        request.authType = 'firebase';
        return true;
      } catch (fbErr) {
        this.logError(jwtErr, token);
        this.logError(fbErr, token);
        throw new UnauthorizedException('Invalid authentication token');
      }
    }
  }

  private validateJwtPayload(payload: any): void {
    if (!payload.sub) {
      throw new Error('JWT missing subject (sub) claim');
    }
  }

  private extractToken(request: Request): string {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }
    return token;
  }

  private logError(error: Error, token: string): void {
    const tokenPreview =
      token.length > 10 ? `${token.slice(0, 5)}...${token.slice(-5)}` : token;

    Logger.error(
      `Authentication failed for token: ${tokenPreview}`,
      error.stack,
      'FirebaseAuthGuard',
    );
  }
}
