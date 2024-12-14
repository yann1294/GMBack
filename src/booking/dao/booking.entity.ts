
import { instanceToPlain } from 'class-transformer';
import { Tour } from 'src/tours/dao/tour.entity';
import { Package } from 'src/tours/dao/package.entity';
import { User } from 'src/tours/vo/helper.vo';

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
  toObject() {
  }

  toUpdateObject(): object {
    return instanceToPlain(this);
  }

  toDeleteObject(): object {
    return { ...this };
  }
}
