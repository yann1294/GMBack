import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { DataService } from 'src/shared/services/data.service';

function extractToken(req: FastifyRequest): string | null {
  // 1) Authorization header
  const auth =
    (req.headers['authorization'] as string | undefined) ??
    (req.headers['Authorization'] as string | undefined);
  if (auth?.startsWith('Bearer ')) return auth.slice(7);

  // 2) HttpOnly cookie fallback (requires @fastify/cookie)
  const cookies = (req as any).cookies as Record<string, string> | undefined;
  if (cookies?.access_token) return cookies.access_token;
  if (cookies?.idToken) return cookies.idToken;

  return null;
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly dataService: DataService, // for Firebase Admin verifyIdToken
    private readonly jwtService: JwtService, // local JWT fallback
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedException('Authorization token required');
    }

    // 1) Try your local JWT first
    try {
      const payload = this.jwtService.verify(token);
      // Require a subject to bind as user id
      if (!payload?.sub) throw new Error('JWT missing `sub` claim');
      (req as any).user = { uid: payload.sub, ...payload };
      (req as any).authType = 'jwt';
      return true;
    } catch (e) {
      // fall through to Firebase
      console.error(
        '[guard] JWT verify failed:',
        (e as any).name,
        (e as any).message,
      );
    }

    // 2) Fallback to Firebase ID token
    try {
      const decoded = await this.dataService.verifyIdToken(token);
      (req as any).user = { uid: decoded.uid, ...decoded };
      (req as any).authType = 'firebase';
      return true;
    } catch (e) {
      console.error(
        '[guard] Firebase verify failed:',
        (e as any).name,
        (e as any).message,
      );
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }
  }
}
