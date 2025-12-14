import { instanceToPlain } from 'class-transformer';
import { Timestamp } from 'firebase-admin/firestore';
import { Tourist } from '../vo/helper.vo';

/**
 * Booking entity
 * - Domain representation of a booking in persistence layer.
 * - Contains Firestore-specific conversion helpers.
 */
export class Booking {
  constructor(
    public id: string,
    // Status: can be ACTIVE, CANCELED, PENDING
    public status: string,
    public bookedOn: Date,
    public tourists: Map<String, Tourist>,
    public bookingType: string,
    // This resourceId is the id of a  tour or of a package
    public resourceId: string,
  ) {}

  /**
   * Convert full Booking entity to Firestore-ready object:
   * - Converts bookedOn to Timestamp if present.
   * - Converts tourists Map<string, Tourist> to a plain object.
   */
  toObject(): object {
    return {
      id: this.id,
      status: this.status,
      bookedOn:
        this.bookedOn === undefined
          ? this.bookedOn
          : Timestamp.fromDate(this.bookedOn),
      tourists: Object.fromEntries(
        Array.from(this.tourists).map(([key, tourist]) => [
          key,
          tourist.toObject(),
        ]),
      ),
      resourceId: this.resourceId,
      bookingType: this.bookingType,
    };
  }

  /**
   * Generic update payload using class-transformer.
   * Suitable for merge/update operations.
   */
  toUpdateObject(): object {
    return instanceToPlain(this);
  }

  /**
   * Basic shallow copy for delete/logging scenarios.
   */
  toDeleteObject(): object {
    return { ...this };
  }
}
