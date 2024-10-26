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

/**
Response object for dataservice operations.
@param status Holds the status of operation. It will be `success` when operation is successful and will display a
firebase error code when operation is unsuccessful.
@param message A message about the completed operation. Will be a firebase error message if operation is
unsuccessful.
@param data Holds the document paths of the created documents or `null` in case of an error.
*/
export type DataServiceResponse = {
  status: string;
  message: string;
  data: string[] | null;
};
