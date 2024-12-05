import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class FirebaseRepository {
  guideMeDb: FirebaseFirestore.Firestore;
  storage: Bucket;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.guideMeDb = firebaseApp.firestore();
    this.guideMeDb.settings({ignoreUndefinedProperties: true});
    this.storage = firebaseApp.storage().bucket();
  }
}
