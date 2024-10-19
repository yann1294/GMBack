export declare interface ActivityLocation {
  name: string;
  city: string;
  country: string;
  address: string;
  latitude: string;
  longitude: string;
}

export declare interface TourLocation {
  name: string;
  city: string;
  country: string;
}

export declare interface Transportation {
  arrivalTime: Date;
  departureTime: Date;
  type: string;
}

export declare interface Accommodation {
  type: string;
  name: string;
}

export declare interface Activity {
  id: string;
  name: string;
  durationHours: number;
  location: ActivityLocation;
  transportation: Transportation;
  accommodation: Accommodation;
}
