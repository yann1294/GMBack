import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from './firebase.service';
import * as path from 'path';
require('dotenv').config();

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [],
  useFactory: () => {
    const firebaseConfig = path.resolve(
      __dirname,
      '../../../gmback-206ae-0db6e855cf1e.json',
    );

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
    });
  },
};

@Module({
  imports: [],
  providers: [firebaseProvider, FirebaseRepository],
  exports: [FirebaseRepository],
})
export class FirebaseModule {}
