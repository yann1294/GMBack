import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';
import { auth } from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
  guideMeDb: FirebaseFirestore.Firestore;
  storage: Bucket;
  auth: auth.Auth;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.guideMeDb = firebaseApp.firestore();
    this.guideMeDb.settings({ ignoreUndefinedProperties: true });
    this.storage = firebaseApp.storage().bucket();
    this.auth = firebaseApp.auth();
  }
}
