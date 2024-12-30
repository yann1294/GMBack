import { Timestamp } from 'firebase-admin/firestore';
import { PackageLocation, User } from '../vo/helper.vo';

export class Package {
  constructor(
    public id: string,
    public name: string,
    public location: PackageLocation,
    public price: number,
    public durationDays: number,
    public discount: number,
    public numberOfSeats: number,
    public description: string,
    public isAvailable: boolean,
    public date: Date,
    public guide?: string,
    public images?: string[],
    public tours?: string[],
  ) {}

  toObject(): object {
    return {
      id: this.id,
      name: this.name,
      location: Object.assign({}, this.location),
      price: this.price,
      durationDays: this.durationDays,
      discount: this.discount,
      numberOfSeats: this.numberOfSeats,
      description: this.description,
      isAvailable: this.isAvailable,
      date: this.date ? Timestamp.fromDate(new Date(this.date)) : this.date,
      guide: this.guide,
      images: this.images ?? [],
      tours: this.tours ?? []
    };
  }

  toUpdateObject(): object {
    return { ...this };
  }
}
