import { forwardRef, Module } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
//import { FileService } from 'src/shared/services/file.service';
//import { TourValidationPipe } from './controller/validation.pipe';
import { CoreService } from './services/tour.core.service';
//import { CoreDAOInterface } from './dao/tour.core.dao.interface';
import { CoreDAO } from './dao/tour.core.dao';
import {
  CORE_DAO_INTERFACE_TOKEN,
  CORE_SERVICE_TOKEN,
  PACKAGE_DAO_INTERFACE_TOKEN,
  PACKAGE_SERVICE_TOKEN,
  TOUR_EXTERNAL_SERVICE_INTERFACE,
} from './token';
import { TourController } from './controller/core.controller';
import { PackageController } from './controller/package.controller';
import { PackageDAO } from './dao/package.dao';
import { PackageService } from './services/package.service';
import { TourExternalService } from './services/tour-external.service';
import { UserModule } from 'src/user-management/user.module';
import { FileService } from 'src/shared/services/file.service';
import { ImageManager } from './utils/upload-images.util';
import { SharedModule } from 'src/shared/shared.module';

/**
 * Reason for using the format below in the provider.
 *  {
      provide: CORE_SERVICE_TOKEN,
      useClass: CoreService,
    }

    Interfaces do not exist during runtime so we need a token to represent interfaces. These tokens should be
    registered as providers. However, if we make use of the classes that implement the interfaces, then we
    do not have to use tokens.
 */
/**
 * Tours module
 * - Wires up controllers, services, DAOs, and utilities for Tours and Packages.
 * - Uses custom provider tokens to bind interface-like abstractions to concrete classes.
 */
@Module({
  // Infrastructure / cross-cutting modules used by the Tours domain
  imports: [FirebaseModule, SharedModule],
  // REST endpoints for tours and packages
  controllers: [TourController, PackageController],
  // Providers registered in the Nest dependency injection container
  providers: [
    // Utility service for handling image uploads for tours/packages/auth
    ImageManager,
    // CoreDAO bound to an interface token to keep the rest of the code decoupled
    {
      provide: CORE_DAO_INTERFACE_TOKEN,
      useClass: CoreDAO,
    },
    // CoreService bound to its abstraction token
    {
      provide: CORE_SERVICE_TOKEN,
      useClass: CoreService,
    },
    // PackageDAO abstraction binding
    {
      provide: PACKAGE_DAO_INTERFACE_TOKEN,
      useClass: PackageDAO,
    },
    // PackageService abstraction binding
    {
      provide: PACKAGE_SERVICE_TOKEN,
      useClass: PackageService,
    },
    // External service used by other modules (e.g. Booking) to interact with Tours
    {
      provide: TOUR_EXTERNAL_SERVICE_INTERFACE,
      useClass: TourExternalService,
    },
  ],
  // Export only the external interface so other modules depend on an abstraction
  exports: [TOUR_EXTERNAL_SERVICE_INTERFACE],
})
export class TourModule {}
