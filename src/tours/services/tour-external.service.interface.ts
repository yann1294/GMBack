import { ResponseObject } from 'src/shared/types';
import { Tour } from '../dao/tour.entity';
import { Booking } from 'src/booking/dao/booking.entity';

export interface TourExternalServiceInterface {

  getTourAvailability(tourId: string): Promise<boolean>;
  //
  // updateTourAvailability(
  //   id: string,
  //   isAvailable: boolean,
  // ): Promise<ResponseObject>;
  // getAssignedGuide(BookingList: Booking[], id: number): Booking; // the guide will be derived from the tour
  // getGuideAvailability(): boolean;
  // getTourSelected(tour: Tour): Tour;
}
