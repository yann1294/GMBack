import { Injectable } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceCondition, ResponseObject } from 'src/shared/types';

import { FieldValue } from 'firebase-admin/firestore';
import { plainToInstance } from 'class-transformer';
import IBookingService from './booking.service.interface';
import { Booking } from '../dao/booking.entity';
import { BookingVO } from '../vo/booking.master.vo';
import { BookingDAO } from '../dao/booking.dao';

@Injectable()
export class BookingService implements IBookingService {
  private readonly collectionName = 'bookings';

  constructor(private readonly bookingDAO: BookingDAO) {}

  async displayTouristBookingHistory(
    touristId: string,
  ): Promise<ResponseObject> {
    return await this.bookingDAO.findAllByTourist(touristId);
  }

  async displayGuideBookingHistory(guideId: string): Promise<ResponseObject> {
    return await this.bookingDAO.findAllByGuide(guideId);
  }

  // TODO: Restructure booking entity to reflect db

  async makeBooking(data: BookingVO): Promise<ResponseObject> {
    return await this.bookingDAO.create(data.toEntity());
  }

  async displayBooking(bookingId: string): Promise<ResponseObject> {
    return await this.bookingDAO.findById(bookingId);
  }

  async modifyBooking(
    bookingId: string,
    booking: BookingVO,
  ): Promise<ResponseObject> {
    return await this.bookingDAO.update(bookingId, booking.toEntity());
  }

  async cancelBooking(bookingId: string, touristId: string | string[]) {
    const bookings: string[] = Array.isArray(touristId)
      ? touristId
      : [touristId];
    return await this.bookingDAO.update(
      bookingId,
      plainToInstance(Booking, {
        bookings: FieldValue.arrayRemove(...bookings),
      }),
    );
  }
}
