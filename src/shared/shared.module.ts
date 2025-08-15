import { Global, Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { DataService } from './services/data.service';
import { FileService } from './services/file.service';

@Global() // optional but convenient; removes the need to import everywhere
@Module({
  imports: [FirebaseModule], // <- gives access to FirebaseRepository
  providers: [DataService, FileService],
  exports: [DataService, FileService], // <- make them available to other modules
})
export class SharedModule {}
