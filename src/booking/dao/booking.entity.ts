import { instanceToPlain } from 'class-transformer';
import { Timestamp } from 'firebase-admin/firestore';

export class Booking {
  constructor(
    public id: string,
    public status: string,
    public bookedOn: Date,
    public tourist: string[],
    public bookingType: string,
    public resourceId: string,
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
      resourceId: this.resourceId,
      bookingType: this.bookingType,
    };
  }

  toUpdateObject(): object {
    return instanceToPlain(this);
  }

  toDeleteObject(): object {
    return { ...this };
  }
}
