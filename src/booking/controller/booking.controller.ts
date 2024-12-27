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
import {
  BOOKING_SERVICE_TOKEN,
  TOUR_EXTERNAL_SERVICE_INTERFACE,
} from '../token';
import { TourExternalServiceInterface } from 'src/tours/services/tour-external.service.interface';
import { UserManagementExternalServiceInterface } from 'src/user-management/services/user-management-external.service.interface';
import { USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE } from 'src/user-management/token';
import CreateBookingDTO from './dto/booking.create.dto';

@Controller('bookings')
export class BookingController {
  collectionName: string = 'bookings';

  constructor(
    @Inject(BOOKING_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
    // private readonly externalTourService: TourExternalService,
    @Inject(TOUR_EXTERNAL_SERVICE_INTERFACE)
    private readonly externalTourService: TourExternalServiceInterface,
    @Inject(USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE)
    private readonly externalUserManagementService: UserManagementExternalServiceInterface,
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

  // TOUR MANAGEMENT SERVICES START

  /**
   * It is getting the availability of a given tour based on its id
   * The tourId of the tour must be a string and it is required.
   * @param tourId
   * @returns a boolean
   *
   */
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

  @Get('assigned-guide/')
  async getAssignedGuide(@Query() currentBooking: CreateBookingDTO) {
    return await this.externalTourService.getAssignedGuide(currentBooking);
  }

  // async makePayment() {}
  // async reserveBooking() {}

  // TOUR MANAGEMENT SERVICES END

  // USER MANAGEMENT SERVICES   START

  // Just an example. To be changed later
  @Get('users/bookings')
  async getBookingDetails(): Promise<void> {
    await this.externalUserManagementService.getBookingDetails(null);
  }
}
