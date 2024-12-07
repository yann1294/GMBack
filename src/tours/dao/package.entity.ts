import { PackageLocation, User } from '../vo/helper.vo';

export class Package {
  constructor(
    public id: string,
    public name: string,
    public location: PackageLocation,
    public price: number,
    public images: string[],
    public durationDays: number,
    public discount: number,
    public numberOfSeats: number,
    public description: string,
    public isAvailable: boolean,
    public guide: User,
  ) {}
  toObject(): object {
    return {
      id: this.id,
      name: this.name,
      location: Object.assign({}, this.location),
      price: this.price,
      images: this.images,
      durationDays: this.durationDays,
      discount: this.discount,
      numberOfSeats: this.numberOfSeats,
      description: this.description,
      isAvailable: this.isAvailable,
      guide: Object.assign({}, this.guide),
    };
  }

  toUpdateObject(): object {
    return { ...this };
  }
}
