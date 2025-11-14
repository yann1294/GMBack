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
import {
  Activity,
  ActivityLocation,
  TourLocation,
  User,
} from '../vo/helper.vo';
import { instanceToPlain } from 'class-transformer';

/**
 * Tour entity
 * - Represents how a Tour is stored in Firestore.
 * - Handles conversion of nested Activity Map into Firestore-friendly objects.
 */
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

  /**
   * Convert full Tour object to Firestore-ready representation.
   * - Flattens location
   * - Converts date to Timestamp
   * - Normalises activities Map to plain nested object
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
            ...(activity.transportation && {
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
            }),
            ...(activity.accommodation && {
              accommodation: {
                type: activity.accommodation.type,
                name: activity.accommodation.name,
              },
            }),
          },
        ]),
      ),
    };
  }

  /**
   * Build a Firestore "update" payload:
   * - Copies scalar fields (except id/activities) as-is.
   * - Normalises activities (Map or object) -> plain object keyed by string index.
   * - Converts nested dates into Timestamps.
   * Intended for partial updates/merges where activities may be changed.
   */
  toUpdateObject(): object {
    console.log('▶ toUpdateObject — activities value →', this.activities);
    console.log('▶ toUpdateObject — is Map?', this.activities instanceof Map);
    console.log(
      '▶ toUpdateObject — keys:',
      this.activities && (this.activities as any).size,
    );

    const plain: any = {};

    // ── copy all scalar props except id & activities ───────────────
    for (const [key, value] of Object.entries(this)) {
      if (key !== 'activities' && key !== 'id' && value !== undefined) {
        plain[key] = value;
      }
    }

    // Normalise activities into a Map<number, Activity>
    let actsMap: Map<number, Activity> | null = null;

    // Build Firestore-ready activities object if we have any activities
    if (this.activities instanceof Map) {
      actsMap = this.activities;
    } else if (this.activities && typeof this.activities === 'object') {
      // Remove entries where value is null/undefined
      actsMap = new Map(
        Object.entries(this.activities as Record<string, any>).map(([k, v]) => [
          Number(k),
          v as Activity,
        ]),
      );
    }

    // ── build the Firestore-ready object ---------------------------
    if (actsMap && actsMap.size) {
      const activitiesObj: Record<string, any> = {};
      // Remove keys whose value is undefined/null
      actsMap = new Map(
        Array.from(actsMap).filter(([, v]) => v !== undefined && v !== null),
      );
      actsMap.forEach((act, key) => {
        if (!act || typeof act !== 'object') return;

        const loc = act.location as ActivityLocation;
        const actPlain: any = {
          id: act.id,
          name: act.name,
          durationHours: act.durationHours,
          location: {
            name: loc?.name,
            city: loc?.city,
            country: loc?.country,
            address: loc?.address,
            location: loc?.location
              ? new GeoPoint(loc.location.latitude, loc.location.longitude)
              : null,
          },
        };

        if (act.transportation) {
          actPlain.transportation = {
            type: act.transportation.type,
            ...(act.transportation.arrivalTime && {
              arrivalTime: Timestamp.fromDate(
                new Date(act.transportation.arrivalTime),
              ),
            }),
            ...(act.transportation.departureTime && {
              departureTime: Timestamp.fromDate(
                new Date(act.transportation.departureTime),
              ),
            }),
          };
        }

        if (act.accommodation) {
          actPlain.accommodation = {
            type: act.accommodation.type,
            name: act.accommodation.name,
          };
        }

        activitiesObj[key.toString()] = actPlain;
      });

      plain.activities = activitiesObj; // ← finally present
    }

    // Normalise date field if present
    if (this.date) {
      plain.date = Timestamp.fromDate(new Date(this.date));
    }

    return plain;
  }

  /**
   * Basic shallow copy used for delete operations or raw merges.
   */
  toDeleteObject(): object {
    return { ...this };
  }
}
