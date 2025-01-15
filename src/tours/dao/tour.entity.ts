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
      date: this.date  ? Timestamp.fromDate(new Date(this.date)) : this.date,
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
            ...(activity.transportation && {
              transportation: {
                arrivalTime: activity.transportation.arrivalTime
                  ? Timestamp.fromDate(new Date(activity.transportation.arrivalTime))
                  : activity.transportation.arrivalTime,
                departureTime: activity.transportation.departureTime
                  ? Timestamp.fromDate(new Date(activity.transportation.departureTime))
                  : activity.transportation.departureTime,
                type: activity.transportation.type,
              },
            }),
            ...(activity.accommodation && {
              accommodation: {
                type: activity.accommodation.type,
                name: activity.accommodation.name,
              },
            }),
          },
        ])
        
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
