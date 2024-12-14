import { instanceToPlain } from 'class-transformer';
import { Timestamp } from 'firebase-admin/firestore';

export class Booking {
  constructor(
    public id: string,
    public status: string,
    public bookedOn: Date,
    public tourist: string[],
    public tour?: string,
    public tourPackage?: string,
  ) {}

  // Convert to object representation
  toObject(): object {
    return {
      id: this.id,
      status: this.status,
      bookedOn:
        this.bookedOn === undefined
          ? this.bookedOn
          : Timestamp.fromDate(this.bookedOn),
      tourist: this.tourist ?? [],
      tour: this.tour,
      tourPackage: this.tourPackage,
    };
  }

  toUpdateObject(): object {
    return instanceToPlain(this);
  }

  toDeleteObject(): object {
    return { ...this };
  }
}
