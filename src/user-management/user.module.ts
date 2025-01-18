import { Module } from "@nestjs/common";
import { FirebaseModule } from "src/shared/firebase/firebase.module";
import { GuideController } from "./controller/guide.controller";
import { TouristController } from "./controller/tourist.controller";
import { ADMIN_DAO_TOKEN, ADMIN_SERVICE_TOKEN, GUIDE_DAO_TOKEN, GUIDE_SERVICE_TOKEN, TOURIST_DAO_TOKEN, TOURIST_SERVICE_TOKEN } from "./utils/token";
import { GuideDAO } from "./dao/guide.dao";
import { DataService } from "src/shared/services/data.service";
import { TouristDAO } from "./dao/tourist.dao";
import { GuideService } from "./services/guide.service";
import { TouristService } from "./services/tourist.service";
import { FileService } from "src/shared/services/file.service";
import { AdminDAO } from "./dao/admin.dao";
import { AdminService } from "./services/admin.service";
import { AdminController } from "./controller/admin.controller";

@Module({
  imports: [FirebaseModule],
  controllers: [GuideController, TouristController, AdminController],
  providers: [
    DataService,
    FileService,
    {
      provide: ADMIN_DAO_TOKEN,
      useClass: AdminDAO,
    },
    {
      provide: ADMIN_SERVICE_TOKEN,
      useClass: AdminService,
    },
    {
      provide: GUIDE_DAO_TOKEN,
      useClass: GuideDAO,
    },
    {
      provide: TOURIST_DAO_TOKEN,
      useClass: TouristDAO,
    },
    {
        provide: GUIDE_SERVICE_TOKEN,
        useClass: GuideService,
      },
      {
        provide: TOURIST_SERVICE_TOKEN,
        useClass: TouristService,
      },
  ],
})
export class UserModule {}