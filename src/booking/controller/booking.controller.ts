import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import IBookingService from '../services/booking.service.interface';
import { BookingValidationPipe, HasAttribute } from './booking.validation.pipe';
import { BookingVO } from '../vo/booking.master.vo';
import { BOOKING_SERVICE_TOKEN } from '../token';
import { TourExternalService } from 'src/tours/services/tour-external.service';

@Controller('bookings')
export class BookingController {
  collectionName: string = 'bookings';

  constructor(
    @Inject(BOOKING_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
    private readonly externalTourService: TourExternalService,
    // @Inject(BOOKING_SERVICE_TOKEN)
    // private readonly externalTourService: TourExternalServiceInterface,
  ) {}

  @Post('create')
  async makeBooking(@Body(new BookingValidationPipe()) bookingVo: BookingVO) {
    return await this.bookingService.makeBooking(bookingVo);
  }

  @Patch('update/:id')
  async modifyBooking(
    @Param('id') bookingId: string,
    @Body(new BookingValidationPipe('update')) bookingVo: BookingVO,
  ) {
    return await this.bookingService.modifyBooking(bookingId, bookingVo);
  }

  @Patch('cancel/:id')
  async cancelBooking(
    @Param('id') bookingId: string,
    @Body(new HasAttribute(['touristId'])) body: { touristId: string },
  ) {
    return await this.bookingService.cancelBooking(bookingId, body.touristId);
  }

  @Get(':id')
  async displayBooking(@Param('id') bookingId: string) {
    return await this.bookingService.displayBooking(bookingId);
  }

  @Get('guide/:id/history')
  async displayGuideBookingHistory(@Param('id') guideId: string) {
    return await this.bookingService.displayGuideBookingHistory(guideId);
  }

  @Get('tourist/:id/history')
  async displayTouristBookingHistory(@Param('id') touristId: string) {
    return await this.bookingService.displayTouristBookingHistory(touristId);
  }

  @Get()
  async getAllBooking() {
    return await this.bookingService.getAllBookings();
  }

  @Get('resource/:id')
  async getBookingByResource(@Param('id') resourceId: string) {
    return await this.bookingService.getBookingsForResource(resourceId);
  }

  @Get('tour/:tourId')
  async getTourAvailability(@Param('tourId') tourId: string) {
    console.log('Get tour availability');
    return await this.externalTourService.getTourAvailability(tourId);
  }

  @Get('tour/selected/:tourSelected')
  async getTourSelected(@Param('tourSelected') tourSelected: string) {
    console.log('Get tour selected');
    return await this.externalTourService.getTourSelected(tourSelected);
  }

  @Patch('availability')
  async updateTourAvailability(
    @Body(new HasAttribute(['isAvailable', 'tourId']))
    body: {
      tourId: string;
      isAvailable: boolean;
    },
  ) {
    return await this.externalTourService.updateTourAvailability(
      body.tourId,
      body.isAvailable,
    );
  }

  // async makePayment() {}
  // async reserveBooking() {}
}
