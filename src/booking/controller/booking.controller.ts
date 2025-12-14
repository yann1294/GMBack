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
import { plainToInstance } from 'class-transformer';

@Controller('bookings')
/**
 * HTTP controller for Booking domain.
 * - Exposes booking CRUD and query endpoints.
 * - Delegates orchestration to BookingService and BookingWorkflow.
 * - Also exposes tour-related helper endpoints via TourExternalService.
 */
export class BookingController {
  // Collection name mainly used for context/logging
  collectionName: string = 'bookings';

  constructor(
    // Core booking application service
    @Inject(BOOKING_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
    // External tour service (from Tours module)
    @Inject(TOUR_EXTERNAL_SERVICE_INTERFACE)
    private readonly externalTourService: ITourExternalService,
    // Booking workflow orchestrator (availability + price + payment)
    private readonly bookingWorkflow: BookingWorkflow,
  ) {}

  /**
   * POST /bookings
   * Create a new booking and run the booking workflow:
   * - check availability
   * - compute price
   * - persist booking
   * - trigger payment workflow
   */
  @Post()
  async makeBooking(
    @Body() dto: CreateBookingDTO, // ✅ let global ValidationPipe validate this
  ): Promise<ResponseObject> {
    /** TODO: code to send the data to the payment module should come after confirmation of successfull  booking.
    i.e here **/
    // Map DTO → VO after validation succeeds
    const bookingVo = plainToInstance(BookingVO, dto);
    return await this.bookingWorkflow.executeBooking(bookingVo);
  }

  /**
   * PATCH /bookings/:id
   * Update an existing booking (basic modification).
   */
  @Patch(':id')
  async modifyBooking(
    @Body(new BookingValidationPipe('update')) bookingVo: BookingVO,
  ) {
    return await this.bookingService.modifyBooking(bookingVo);
  }

  /**
   * DELETE /bookings/:id
   * Cancel/remove a booking.
   * - Uses ConvertToVoPipe to build a BookingVO from request data.
   */
  @Delete(':id')
  async cancelBooking(@Req() req: FastifyRequest) {
    const validationPipe = new ConvertToVoPipe('booking', true);
    const bookingVo: BookingVO = (await validationPipe.transform(req, {
      type: 'body',
      metatype: BookingVO,
    })) as BookingVO;
    return await this.bookingService.cancelBooking(bookingVo);
  }

  /**
   * GET /bookings/:id
   * Retrieve an individual booking by id.
   */
  @Get(':id')
  async displayBooking(@Req() req: FastifyRequest) {
    const validationPipe = new ConvertToVoPipe('booking');
    const bookingVo: BookingVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: BookingVO,
    })) as BookingVO;
    console.log(bookingVo);
    return await this.bookingService.displayBooking(bookingVo);
  }

  /**
   * GET /bookings/guide/:uid/history
   * Return all bookings related to tours/packages guided by the given guide.
   */
  @Get('guide/:uid/history')
  async displayGuideBookingHistory(@Req() req: FastifyRequest) {
    const validationPipe = new ConvertToVoPipe('guide', false, 'uid');
    const guideVo: GuideVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: GuideVO,
    })) as GuideVO;
    return await this.bookingService.displayGuideBookingHistory(guideVo);
  }

  /**
   * GET /bookings/tourist/:uid/history
   * Return all bookings created by the given tourist.
   */
  @Get('tourist/:uid/history')
  async displayTouristBookingHistory(@Req() req: FastifyRequest) {
    const validationPipe = new ConvertToVoPipe('tourist', false, 'uid');
    const touristVo: TouristVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TouristVO,
    })) as TouristVO;
    return await this.bookingService.displayTouristBookingHistory(touristVo);
  }

  /**
   * GET /bookings
   * List all bookings in the system.
   */
  @Get()
  async getAllBooking(@Req() req: FastifyRequest) {
    return await this.bookingService.getAllBookings();
  }

  /**
   * GET /bookings/tours/:tour
   * List bookings for a specific tour (resourceId = tour id).
   * - Uses ConvertToVoPipe with "tour" context to map route param.
   */
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

  /**
   * GET /bookings/packages/:tourPackage
   * List bookings for a specific package (resourceId = package id).
   */
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

  // ────────────── TOUR MANAGEMENT INTEGRATION ENDPOINTS ──────────────

  /**
   * GET /bookings/tour/:tourId
   * Proxy to Tours module: check tour availability by id.
   */
  @Get('tour/:tourId')
  async getTourAvailability(@Param('tourId') tourId: string) {
    console.log('Get tour availability');
    return await this.externalTourService.getTourAvailability(tourId);
  }

  /**
   * GET /bookings/tour/selected/:tourSelected
   * Proxy to Tours module: fetch a tour by name (selected tour).
   */
  @Get('tour/selected/:tourSelected')
  async getTourSelected(@Param('tourSelected') tourSelected: string) {
    console.log('Get tour selected');
    return await this.externalTourService.getTourSelected(tourSelected);
  }

  /**
   * PATCH /bookings/availability
   * Proxy to Tours module: update tour availability.
   * Currently returns null until the external service API is finalised.
   */
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

  /**
   * GET /bookings/assigned-guide
   * Proxy to Tours module: derive the guide assigned to the booking's tour/package.
   */
  @Get('assigned-guide/')
  async getAssignedGuide(@Query() currentBooking: CreateBookingDTO) {
    return await this.externalTourService.getAssignedGuide(currentBooking);
  }

  // async makePayment() {}
  // async reserveBooking() {}

  // TOUR MANAGEMENT SERVICES END

  // USER MANAGEMENT SERVICES   START
}
