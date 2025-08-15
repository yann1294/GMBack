// src/auth/guards/admin.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const user = (req as any).user; // from FirebaseAuthGuard
    if (!user) throw new UnauthorizedException();

    // Accept either structured role or boolean flag
    const isAdmin =
      user.role === 'admin' ||
      user.admin === true ||
      (user.customClaims && user.customClaims.role === 'admin');
    if (!isAdmin) throw new ForbiddenException('Admins only');
    return true;
  }
}
