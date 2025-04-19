// firebase-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { JwtService } from '@nestjs/jwt'; // Add JWT service

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly dataService: DataService,
    private readonly jwtService: JwtService, // Inject JWT service
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    console.log('Extracted token:', token);

    if (!token) {
      console.error('No token found');
      return false;
    }

    // Try both verification methods
    return (
      (await this.verifyFirebaseToken(token, request)) ||
      (await this.verifyJwtToken(token, request))
    );
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  private async verifyFirebaseToken(
    token: string,
    request: any,
  ): Promise<boolean> {
    try {
      request.user = await this.dataService.verifyIdToken(token);
      console.log('Firebase token verified', request.user);
      request.authType = 'firebase';
      return true;
    } catch (e) {
      return false;
    }
  }

  private async verifyJwtToken(token: string, request: any): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token);
      request.user = {
        ...payload,
        uid: payload.sub, // Map JWT sub to uid
      };
      request.authType = 'jwt';
      return true;
    } catch (e) {
      return false;
    }
  }
}
