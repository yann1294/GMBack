import { Inject, Injectable } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceCondition, ResponseObject } from 'src/shared/types';

import { FieldValue } from 'firebase-admin/firestore';
import { plainToInstance } from 'class-transformer';
import IBookingService from './booking.service.interface';
import { Booking } from '../dao/booking.entity';
import { BookingVO } from '../vo/booking.master.vo';
import { BOOKING_DAO_INTERFACE_TOKEN } from '../token';
import IBookingServiceDAO from '../dao/booking.dao.interface';
import { Tourist } from '../vo/helper.vo';
import { BookingMessageService } from './booking-message.service';

@Injectable()
export class BookingService implements IBookingService {
  private readonly collectionName = 'bookings';

  constructor(
    @Inject(BOOKING_DAO_INTERFACE_TOKEN)
    private readonly bookingDAO: IBookingServiceDAO,
    private readonly bookingMessageBroker: BookingMessageService,
  ) {}

  async getAllBookings(): Promise<ResponseObject> {
    this.bookingMessageBroker.sendDataToPayment('nothing', 'anything');
    return await this.bookingDAO.findAll();
  }

  async getBookingsForResource(resoruceId: string): Promise<ResponseObject> {
    return await this.bookingDAO.findByResourceId(resoruceId);
  }

  async displayTouristBookingHistory(
    touristId: string,
  ): Promise<ResponseObject> {
    return await this.bookingDAO.findAllByTourist(touristId);
  }

  async displayGuideBookingHistory(guideId: string): Promise<ResponseObject> {
    return await this.bookingDAO.findAllByGuide(guideId);
  }

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

  async cancelBooking(bookingId: string, touristId: string) {
    // Initialize the Map
    let touristData: Map<string, Tourist> = new Map<string, Tourist>();
    touristData.set(touristId, { bookingStatus: 'canceled' } as Tourist);

    // Convert the Map to a plain object
    let touristDataObject = Object.fromEntries(touristData);

    // Convert the object to the instance of BookingVO
    const bookingVOInstance = plainToInstance(BookingVO, touristDataObject);

    // Assuming `toEntity()` is a valid method that converts the instance to the desired entity
    return await this.bookingDAO.delete(
      bookingId,
      bookingVOInstance.toEntity(),
    );
  }
}
