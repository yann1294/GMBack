import { Controller, Post } from '@nestjs/common';
import { log } from 'console';
import { FirebaseRepository } from 'src/shared/firebase/firebase.service';

@Controller('tours')
export class TourController {
  // inject firebase repository
  constructor(private firebaseRepository: FirebaseRepository) {}

  @Post('create')
  async createTour(): Promise<string> {
    // create dummy tour
    const result = await this.firebaseRepository.guideMeDb
      .collection('tour')
      .add({ name: 'Test repo' });
    log('Document created');
    return result.id;
  }
}
