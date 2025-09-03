import { Inject, Injectable } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceCondition, ResponseObject } from 'src/shared/types';

import { FieldValue } from 'firebase-admin/firestore';
import { plainToInstance } from 'class-transformer';
import IBookingService from './booking.service.interface';
import { Booking } from '../dao/booking.entity';
import { BookingVO } from '../vo/booking.master.vo';
import {
  BOOKING_DAO_INTERFACE_TOKEN,
  TOUR_EXTERNAL_SERVICE_INTERFACE,
} from '../token';
import IBookingDAO from '../dao/booking.dao.interface';
import { Tourist } from '../vo/helper.vo';
import { BookingMessageService } from './booking.message-broker.service';
import { TouristVO } from 'src/user-management/vo/tourist.vo';
import { GuideVO } from 'src/user-management/vo/guide.vo';

import { InventoryManagement } from '../utils/inventory.management';
import { PaymentInfoVo } from 'src/booking/vo/payment-info.vo';
import { ITourExternalService } from 'src/tours/services/tour-external.service.interface';

@Injectable()
export class BookingService implements IBookingService {
  private readonly collectionName = 'bookings';
  private inventoryManagement: InventoryManagement;

  constructor(
    @Inject(BOOKING_DAO_INTERFACE_TOKEN)
    private readonly bookingDAO: IBookingDAO,
    private readonly bookingMessageBroker: BookingMessageService,
    @Inject(TOUR_EXTERNAL_SERVICE_INTERFACE)
    private readonly tourExternalService: ITourExternalService,
  ) {}

  async getAllBookings(): Promise<ResponseObject> {
    return await this.bookingDAO.findAll();
  }
  async getBookingsForResource(bookingVo: BookingVO): Promise<ResponseObject> {
    return await this.bookingDAO.findByResourceId(bookingVo.toEntity());
  }

  async displayTouristBookingHistory(
    touristVo: TouristVO,
  ): Promise<ResponseObject> {
    return await this.bookingDAO.findAllByTourist(touristVo.toEntity());
  }

  async displayGuideBookingHistory(guideVo: GuideVO): Promise<ResponseObject> {
    return await this.bookingDAO.findAllByGuide(guideVo.toEntity());
  }

  async makeBooking(bookingVo: BookingVO): Promise<ResponseObject> {
    const makeBookingResponse = await this.bookingDAO.create(
      bookingVo.toEntity(),
    );
    if (makeBookingResponse.status === 'success') {
      const paymentData = this.transformBookingDataToPaymentData(bookingVo);
      // the name of the chanel can be put in a properties file
      this.bookingMessageBroker.sendDataToPayment(
        'booking.payment', // Name of chanel
        paymentData,
      );
    }
    return makeBookingResponse;
  }

  async transformBookingDataToPaymentData(
    bookingVo: BookingVO,
  ): Promise<PaymentInfoVo> {
    //const tourId = await this.tourExternalService.getTourSelected(bookingVo.getTour()).data['id'];
    const tourId = '1';

    // touristID will be obtained from the ID of the person making the booking. i.e from authentication module

    // const paymentData: PaymentInfoVo = {
    //   // tourId: tourId,
    //   // totalAmount: this.inventoryManagement.computePrice(),
    //   // touristId: 'touristId',
    //   // name: 'The name of the tour',
    // };
    //return paymentData;
    return null;
  }

  async makePayment(): Promise<PaymentInfoVo> {
    return null;
  }

  async displayBooking(bookingVo: BookingVO): Promise<ResponseObject> {
    return await this.bookingDAO.findById(bookingVo.toEntity());
  }

  async modifyBooking(bookingVo: BookingVO): Promise<ResponseObject> {
    return await this.bookingDAO.update(bookingVo.toEntity());
  }

  async cancelBooking(bookingVo: BookingVO) {
    // Assuming `toEntity()` is a valid method that converts the instance to the desired entity
    return await this.bookingDAO.delete(bookingVo.toEntity());
  }
}
