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
  Req,
  Request,
} from '@nestjs/common';
import IBookingService from '../services/booking.service.interface';
import { BookingValidationPipe } from './booking.validation.pipe';
import { BookingVO } from '../vo/booking.master.vo';

import {
  BOOKING_SERVICE_TOKEN,
  TOUR_EXTERNAL_SERVICE_INTERFACE,
} from '../token';
import { ITourExternalService } from 'src/tours/services/tour-external.service.interface';
import { IUserManagementExternalService } from 'src/user-management/services/user-management-external.service.interface';
import { USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE } from 'src/user-management/token';
import CreateBookingDTO from './dto/booking.create.dto';
import { ResponseObject } from 'src/shared/types';
import { HasAttribute } from 'src/shared/pipes/has-attribute.pipe';
import { FastifyRequest } from 'fastify';
import { ConvertToVoPipe } from 'src/shared/pipes/convert-to-vo.pipe';
import { CONTEXT } from 'src/shared/utils/context';
import { GuideVO } from 'src/user-management/vo/guide.vo';
import { TouristVO } from 'src/user-management/vo/tourist.vo';
import { BookingWorkflow } from '../utils/booking.workflow';

import { BookingMessageService } from '../services/booking.message-broker.service';

@Controller('bookings')
export class BookingController {
  collectionName: string = 'bookings';

  constructor(
    @Inject(BOOKING_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
    // private readonly externalTourService: TourExternalService,
    @Inject(TOUR_EXTERNAL_SERVICE_INTERFACE)
    private readonly externalTourService: ITourExternalService,
    // @Inject(USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE)
    // private readonly externalUserManagementService: IUserManagementExternalService,
    private readonly bookingWorkflow: BookingWorkflow,
    private readonly bookingMessageService: BookingMessageService,
  ) {}

  // create new booking
  @Post()
  async makeBooking(
    @Body(new BookingValidationPipe()) bookingVo: BookingVO,
  ): Promise<ResponseObject> {
    // TODO: code to send the data to the payment module should come after confirmation of successfull booking.
    // i.e here
    return await this.bookingWorkflow.executeBooking(bookingVo);
  }

  // update an existing booking
  @Patch(':id')
  async modifyBooking(
    @Body(new BookingValidationPipe('update')) bookingVo: BookingVO,
  ) {
    return await this.bookingService.modifyBooking(bookingVo);
  }

  // delete an existing booking
  @Delete(':id')
  async cancelBooking(@Req() req: FastifyRequest) {
    const validationPipe = new ConvertToVoPipe('booking', true);
    const bookingVo: BookingVO = (await validationPipe.transform(req, {
      type: 'body',
      metatype: BookingVO,
    })) as BookingVO;
    return await this.bookingService.cancelBooking(bookingVo);
  }

  // get a booking by id
  @Get(':id')
  async displayBooking(@Req() req: FastifyRequest) {
    const validationPipe = new ConvertToVoPipe('booking');
    const bookingVo: BookingVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: BookingVO,
    })) as BookingVO;
    //console.log(bookingVo);
    console.log('Rabbit mq data');
    this.bookingMessageService.requestResponseFromPayment(
      null,
      'Nothing',
      'anything',
    );
    return await this.bookingService.displayBooking(bookingVo);
  }

  // get booking history for a specific guide
  @Get('guide/:uid/history')
  async displayGuideBookingHistory(@Req() req: FastifyRequest) {
    const validationPipe = new ConvertToVoPipe('guide', false, 'uid');
    const guideVo: GuideVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: GuideVO,
    })) as GuideVO;
    return await this.bookingService.displayGuideBookingHistory(guideVo);
  }

  // get booking history for a specific tourist
  @Get('tourist/:uid/history')
  async displayTouristBookingHistory(@Req() req: FastifyRequest) {
    const validationPipe = new ConvertToVoPipe('tourist', false, 'uid');
    const touristVo: TouristVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TouristVO,
    })) as TouristVO;
    return await this.bookingService.displayTouristBookingHistory(touristVo);
  }

  // get all bookings
  @Get()
  async getAllBooking(@Req() req: FastifyRequest) {
    this.bookingMessageService.sendDataToPayment('Nothing', 'Nada');
    return await this.bookingService.getAllBookings();
  }

  // get bookings for a specific tour
  @Get('tours/:tour')
  async getBookingByTour(@Req() req: FastifyRequest) {
    req.body = { id: 'none' };
    const validationPipe = new ConvertToVoPipe('booking', true, 'tour');
    const bookingVo: BookingVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: BookingVO,
    })) as BookingVO;
    return await this.bookingService.getBookingsForResource(bookingVo);
  }

  // get bookings for a specific package
  @Get('packages/:tourPackage')
  async getBookingByPackage(@Req() req: FastifyRequest) {
    req.body = { id: 'none' };
    const validationPipe = new ConvertToVoPipe('booking', true, 'tourPackage');
    const bookingVo: BookingVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: BookingVO,
    })) as BookingVO;
    return await this.bookingService.getBookingsForResource(bookingVo);
  }

  // TOUR MANAGEMENT SERVICES START

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
    // return await this.externalTourService.updateTourAvailability(
    //   body.tourId,
    //   body.isAvailable,
    // );
    return null;
  }

  @Get('assigned-guide/')
  async getAssignedGuide(@Query() currentBooking: CreateBookingDTO) {
    return await this.externalTourService.getAssignedGuide(currentBooking);
  }

  // async makePayment() {}
  // async reserveBooking() {}

  // TOUR MANAGEMENT SERVICES END

  // USER MANAGEMENT SERVICES   START
}
