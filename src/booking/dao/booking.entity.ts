import { GeoPoint, Timestamp } from 'firebase-admin/firestore';
import { Activity, TourLocation, User } from '../vo/helper.vo';
import { instanceToPlain } from 'class-transformer';

export class Booking {
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
    public activities: Map<number, Activity>,
    public date: Date,
    public images?: string[],
    public guide?: string,
  ) {}

  // Convert to object representation
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
      guide: this.guide,
      images: this.images ?? [],
      date: this.date ? Timestamp.fromDate(new Date(this.date)) : this.date,
      activities: Object.fromEntries(
        Array.from(this.activities).map(([key, activity]) => [
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
              arrivalTime: activity.transportation.arrivalTime
                ? Timestamp.fromDate(
                    new Date(activity.transportation.arrivalTime),
                  )
                : activity.transportation.arrivalTime,
              departureTime: activity.transportation.departureTime
                ? Timestamp.fromDate(
                    new Date(activity.transportation.departureTime),
                  )
                : activity.transportation.departureTime,
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
