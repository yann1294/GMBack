import { ResponseObject } from 'src/shared/types';
import { GuideVO } from '../vo/guide.vo';
import { BookingVO } from 'src/booking/vo/booking.master.vo';

export interface IGuideService {
  addGuide(guideVo: GuideVO): Promise<ResponseObject>;
  deleteGuide(guideVo: GuideVO): Promise<ResponseObject>;
  updateGuide(guideVo: GuideVO): Promise<ResponseObject>;
  findGuide(uid: string): Promise<ResponseObject>;
  approveGuide(guideId: string): Promise<ResponseObject>;
  rejectGuide(guideId: string): Promise<ResponseObject>;
  deactivateGuide(guideId: string): Promise<ResponseObject>;
  approveBooking(bookingVo: BookingVO): Promise<ResponseObject>;
  declineBooking(bookingVo: BookingVO): Promise<ResponseObject>;
  getAllGuides(): Promise<ResponseObject>;

  // from tour container
  getTours(): Promise<ResponseObject>;
  getPackages(): Promise<ResponseObject>;
  readBookings(): Promise<ResponseObject>;
}
