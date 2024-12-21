import { instanceToPlain } from 'class-transformer';
import { Timestamp } from 'firebase-admin/firestore';
import { Tourist } from '../vo/helper.vo';

export class Booking {
  constructor(
    public id: string,
    public status: string,
    public bookedOn: Date,
    public tourists: Map<String, Tourist>,
    public bookingType: string,
    public resourceId: string,
  ) { }

  // Convert to object representation
  toObject(): object {
    return {
      id: this.id,
      status: this.status,
      bookedOn:
        this.bookedOn === undefined
          ? this.bookedOn
          : Timestamp.fromDate(this.bookedOn),
      tourist: Object.assign({}, this.tourists),
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
