import { ResponseObject } from 'src/shared/types';
import { Tour } from '../dao/tour.entity';
import { Booking } from 'src/booking/dao/booking.entity';
import { TourDTO } from '../controller/dto/tour.dto';

export interface TourExternalServiceInterface {
  getTourAvailability(tourId: string): Promise<boolean>;
  getTourSelected(tourName: string): Promise<ResponseObject>;
  updateTourAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<ResponseObject>;
  // getAssignedGuide(BookingList: Booking[], id: number): Booking; // the guide will be derived from the tour
  // getGuideAvailability(): boolean;
  // TODO: Initial value in the diagram
  //getTourSelected(tour: TourDTO): Promise<TourDTO>;
}
