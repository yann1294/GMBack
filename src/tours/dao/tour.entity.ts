import { GeoPoint, Timestamp } from 'firebase-admin/firestore';
import { Activity, TourLocation, User } from '../vo/helper.vo';

export class Tour {
  constructor(
    public id: string,
    public name: string,
    public location: TourLocation,
    public price: number,
    public durationDays: number,
    public discount: number,
    public numberOfSeats: number,
    public description: string,
    public isAvailable: boolean,
    public guide: User,
    public activities: Map<number, Activity>,
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
      guide: Object.assign({}, this.guide),
      activities: Object.fromEntries(
        Array.from(this.activities).map((activity) => [
          activity[0],
          {
            id: activity[1].id,
            name: activity[1].name,
            durationHours: activity[1].durationHours,
            location: {
              name: activity[1].location.name,
              city: activity[1].location.city,
              country: activity[1].location.country,
              address: activity[1].location.address,
              location: new GeoPoint(
                activity[1].location.location.latitude,
                activity[1].location.location.longitude,
              ),
            },
            transportation: {
              arrivalTime: Timestamp.fromDate(
                new Date(activity[1].transportation.arrivalTime),
              ),
              departureTime: Timestamp.fromDate(
                new Date(activity[1].transportation.departureTime),
              ),
              type: activity[1].transportation.type,
            },
            accommodation: {
              type: activity[1].accommodation.type,
              name: activity[1].accommodation.name,
            },
          },
        ]),
      ),
    };
  }
}
