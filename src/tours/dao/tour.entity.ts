// import { GeoPoint, Timestamp } from 'firebase-admin/firestore';
// import { Activity, TourLocation, User } from '../vo/helper.vo';
// import { instanceToPlain } from 'class-transformer';

// export class Tour {
//   constructor(
//     public id: string,
//     public name: string,
//     public location: TourLocation,
//     public price: number,
//     public durationDays: number,
//     public discount: number,
//     public numberOfSeats: number,
//     public description: string,
//     public isAvailable: boolean,
//     public activities: Map<number, Activity>,
//     public date: Date,
//     public images?: string[],
//     public guide?: string,
//   ) {}
//   toObject(): object {
//     return {
//       id: this.id,
//       name: this.name,
//       location: Object.assign({}, this.location),
//       price: this.price,
//       durationDays: this.durationDays,
//       discount: this.discount,
//       numberOfSeats: this.numberOfSeats,
//       description: this.description,
//       isAvailable: this.isAvailable,
//       guide: this.guide,
//       images: this.images ?? [],
//       date: Timestamp.fromDate(new Date(this.date)),
//       activities: Object.fromEntries(
//         Array.from(this.activities).map((activity) => [
//           activity[0],
//           {
//             id: activity[1].id,
//             name: activity[1].name,
//             durationHours: activity[1].durationHours,
//             location: {
//               name: activity[1].location.name,
//               city: activity[1].location.city,
//               country: activity[1].location.country,
//               address: activity[1].location.address,
//               location: new GeoPoint(
//                 activity[1].location.location.latitude,
//                 activity[1].location.location.longitude,
//               ),
//             },
//             transportation: {
//               arrivalTime: Timestamp.fromDate(
//                 new Date(activity[1].transportation.arrivalTime),
//               ),
//               departureTime: Timestamp.fromDate(
//                 new Date(activity[1].transportation.departureTime),
//               ),
//               type: activity[1].transportation.type,
//             },
//             accommodation: {
//               type: activity[1].accommodation.type,
//               name: activity[1].accommodation.name,
//             },
//           },
//         ]),
//       ),
//     };
//   }

//   toUpdateObject(): object {
//     return instanceToPlain(this);
//   }

//   toDeleteObject(): object {
//     return {...this}
//   }
    
// }
import { GeoPoint, Timestamp } from 'firebase-admin/firestore';
import { Activity, TourLocation, User } from '../vo/helper.vo';
import { instanceToPlain } from 'class-transformer';

export class Tour {
  // Private fields
  private _id: string;
  private _name: string;
  private _location: TourLocation;
  private _price: number;
  private _durationDays: number;
  private _discount: number;
  private _numberOfSeats: number;
  private _description: string;
  private _isAvailable: boolean;
  private _activities: Map<number, Activity>;
  private _date: Date;
  private _images?: string[];
  private _guide?: string;

  constructor(
    id: string,
    name: string,
    location: TourLocation,
    price: number,
    durationDays: number,
    discount: number,
    numberOfSeats: number,
    description: string,
    isAvailable: boolean,
    activities: Map<number, Activity>,
    date: Date,
    images?: string[],
    guide?: string,
  ) {
    this._id = id;
    this._name = name;
    this._location = location;
    this._price = price;
    this._durationDays = durationDays;
    this._discount = discount;
    this._numberOfSeats = numberOfSeats;
    this._description = description;
    this._isAvailable = isAvailable;
    this._activities = activities;
    this._date = date;
    this._images = images;
    this._guide = guide;
  }

  // Getters and Setters
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get location(): TourLocation {
    return this._location;
  }
  set location(value: TourLocation) {
    this._location = value;
  }

  get price(): number {
    return this._price;
  }
  set price(value: number) {
    this._price = value;
  }

  get durationDays(): number {
    return this._durationDays;
  }
  set durationDays(value: number) {
    this._durationDays = value;
  }

  get discount(): number {
    return this._discount;
  }
  set discount(value: number) {
    this._discount = value;
  }

  get numberOfSeats(): number {
    return this._numberOfSeats;
  }
  set numberOfSeats(value: number) {
    this._numberOfSeats = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }
  set isAvailable(value: boolean) {
    this._isAvailable = value;
  }

  get activities(): Map<number, Activity> {
    return this._activities;
  }
  set activities(value: Map<number, Activity>) {
    this._activities = value;
  }

  get date(): Date {
    return this._date;
  }
  set date(value: Date) {
    this._date = value;
  }

  get images(): string[] | undefined {
    return this._images;
  }
  set images(value: string[] | undefined) {
    this._images = value;
  }

  get guide(): string | undefined {
    return this._guide;
  }
  set guide(value: string | undefined) {
    this._guide = value;
  }

  // Convert to object representation
  toObject(): object {
    return {
      id: this._id,
      name: this._name,
      location: Object.assign({}, this._location),
      price: this._price,
      durationDays: this._durationDays,
      discount: this._discount,
      numberOfSeats: this._numberOfSeats,
      description: this._description,
      isAvailable: this._isAvailable,
      guide: this._guide,
      images: this._images ?? [],
      date: Timestamp.fromDate(new Date(this._date)),
      activities: Object.fromEntries(
        Array.from(this._activities).map(([key, activity]) => [
          key,
          {
            id: activity.id,
            name: activity.name,
            durationHours: activity.durationHours,
            location: {
              name: activity.location.name,
              city: activity.location.city,
              country: activity.location.country,
              address: activity.location.address,
              location: new GeoPoint(
                activity.location.location.latitude,
                activity.location.location.longitude,
              ),
            },
            transportation: {
              arrivalTime: Timestamp.fromDate(
                new Date(activity.transportation.arrivalTime),
              ),
              departureTime: Timestamp.fromDate(
                new Date(activity.transportation.departureTime),
              ),
              type: activity.transportation.type,
            },
            accommodation: {
              type: activity.accommodation.type,
              name: activity.accommodation.name,
            },
          },
        ]),
      ),
    };
  }

  toUpdateObject(): object {
    return instanceToPlain(this);
  }

  toDeleteObject(): object {
    return { ...this };
  }
}
