import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
  guideMeDb: FirebaseFirestore.Firestore;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.guideMeDb = firebaseApp.firestore();
  }
}
