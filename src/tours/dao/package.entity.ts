import { Timestamp } from 'firebase-admin/firestore';
import { PackageLocation, User } from '../vo/helper.vo';

/**
 * Package entity
 * - Represents how a Package is stored in Firestore.
 * - Handles conversion to plain object (with Firestore Timestamp).
 */
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

  /**
   * Convert the entity to a Firestore-ready object.
   * - location flattened with Object.assign
   * - date converted to Timestamp if defined
   * - images / tours default to empty arrays if undefined
   */
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
      tours: this.tours ?? [],
    };
  }

  /**
   * Shallow copy used for full updates/merges where the DAO handles conversion.
   */
  toUpdateObject(): object {
    return { ...this };
  }
}
