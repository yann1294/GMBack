import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthDAO } from './dao/auth.dao';
import { JwtModule } from '@nestjs/jwt';
import { DataService } from 'src/shared/services/data.service';
import { FileService } from 'src/shared/services/file.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { AuthController } from './controller/auth.controller';
import { ImageManager } from 'src/tours/utils/upload-images.util';
import { SharedModule } from 'src/shared/shared.module';
import { AdminGuard } from './utils/guards/admin.guard';
import { FirebaseAuthGuard } from './utils/firebase-auth.guard';

@Global()
@Module({
  imports: [
    FirebaseModule,
    SharedModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'someSecretKey',
      signOptions: { algorithm: 'HS256', expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthDAO,
    DataService,
    FileService,
    ImageManager,
    FirebaseAuthGuard,
    AdminGuard,
    {
      provide: 'IAuthDAO',
      useClass: AuthDAO,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
  ],
  exports: [AuthService, FirebaseAuthGuard, AdminGuard, JwtModule],
})
export class AuthModule {}
