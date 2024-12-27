import CreateBookingDTO from 'src/booking/controller/dto/booking.create.dto';
import { ResponseObject } from 'src/shared/types';

export interface TourExternalServiceInterface {
  getTourAvailability(tourId: string): Promise<boolean>;
  getTourSelected(tourName: string): Promise<ResponseObject>;
  updateTourAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<ResponseObject>;
  // Old param: (currentBooking: Booking[], id: number): We do not really need a list of all the bookings since
  // we are going to precess 1 booking at a time.
  // The actual parameters will take just the current booking.  TODO: This could be simplified to the tourId and the packageId of the booking
  //
  getAssignedGuide(currentBooking: CreateBookingDTO): Promise<ResponseObject>; // the guide will be derived from the tour
  getGuideAvailability(tourId: string): Promise<boolean>;
  // TODO: Initial value in the diagram
}
