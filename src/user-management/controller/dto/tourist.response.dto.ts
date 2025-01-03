import { UserDTO } from "./helper.dto";
import { Expose } from "class-transformer";

export class TouristResponseDTO extends UserDTO {
  @Expose()
  public favoriteDestinations: string[]; // A list of favorite destinations for the tourist

  @Expose()
  public bookedTripsCount: number; // Number of trips booked by the tourist

  @Expose()
  public lastTripDate: Date | null; // Date of the last trip, or null if none

  @Expose()
  public associatedGuides: string[]; // List of guide IDs or names associated with the tourist
}
/**
  * Derived Fields:
  Fields like bookedTripsCount and lastTripDate might be dynamically calculated at the service layer 
  before mapping to TouristResponseDTO 
*/