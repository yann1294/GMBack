// firebase-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly dataService: DataService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      request.user = await this.dataService.verifyIdToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
