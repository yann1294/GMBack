import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthDAO } from './dao/auth.dao';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'someSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, AuthDAO],
  exports: [AuthService],
})
export class AuthModule {}
