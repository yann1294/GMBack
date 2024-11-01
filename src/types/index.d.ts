import { GeoPoint, WhereFilterOp } from 'firebase-admin/firestore';

export declare interface IActivityLocation {
  name: string;
  city: string;
  country: string;
  address: string;
  location: GeoPoint;
}

export declare interface ITourLocation {
  name: string;
  city: string;
  country: string;
}

export declare interface ITransportation {
  arrivalTime: Date;
  departureTime: Date;
  type: string;
}

export declare interface IAccommodation {
  type: string;
  name: string;
}

export declare interface IActivity {
  id: number;
  name: string;
  durationHours: number;
  location: ActivityLocation;
  transportation: Transportation;
  accommodation: Accommodation;
}

/**
 * Response object for DataService operations.
 *
 * @param status - The operation status; `success` for success or `failure` for failure/error.
 * @param code - A numeric or string error code if the operation fails.
 * @param message - A message regarding the operation; includes a Firebase error message if unsuccessful.
 * @param data - Document paths/data of created documents or `null` if there’s an error.
 */
export type DataServiceResponse = {
  status: string;
  code: string | number;
  message: string;
  data: string[] | object[] | null;
};
//TODO: return only string when only one object is created

/**
 * Condition object for DataService operations.
 *
 * @param fieldPath - The path or field to compare.
 * @param operationString - The operation string from `WhereFilterOp`.
 * @param value - The value for comparison.
 */
export type DataServiceCondition = {
  fieldPath: string;
  operationString: WhereFilterOp;
  value: any;
};

/**
 * Response object for file service operations.
 *
 * @param status - The operation status; `success` for success or `failure` for failure/error.
 * @param code - A string or numeric error code if the operation fails.
 * @param message - A message regarding the operation, including any error details.
 * @param data - Array of file paths or `null` if there’s an error.
 */
export type FileServiceResponse = {
  status: string;
  code: string | number;
  message: string;
  data: string[] | null;
};

export interface IUser {
  name: string;
}
