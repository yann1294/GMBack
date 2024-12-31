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
import { BOOKING_SERVICE_TOKEN } from '../token';
import { ResponseObject } from 'src/shared/types';
import { HasAttribute } from 'src/shared/pipes/has-attribute.pipe';
import { FastifyRequest } from 'fastify';
import { ConvertToVoPipe } from 'src/shared/pipes/convert-to-vo.pipe';
import { CONTEXT } from 'src/shared/utils/context';
import { GuideVO } from 'src/user-management/vo/user.guide.vo';
import { TouristVO } from 'src/user-management/vo/user.tourist.vo';

@Controller('bookings')
export class BookingController {
  collectionName: string = 'bookings';

  constructor(
    @Inject(BOOKING_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
  ) { }

  @Post('create')
  async makeBooking(@Body(new BookingValidationPipe()) bookingVo: BookingVO): Promise<ResponseObject> {
    return await this.bookingService.makeBooking(bookingVo);
  }

  @Patch('update')
  async modifyBooking(
    @Body(new BookingValidationPipe('update')) bookingVo: BookingVO,
  ) {
    return await this.bookingService.modifyBooking(bookingVo);
  }
  @Patch('cancel')
  async cancelBooking(
    @Req() req: FastifyRequest
  ) {
    const validationPipe = new ConvertToVoPipe("booking", true);
    const bookingVo: BookingVO = await validationPipe.transform(req, { type: 'body', metatype: BookingVO }) as BookingVO;
    return await this.bookingService.cancelBooking(bookingVo);
  }

  @Get(':id')
  async displayBooking(
    @Req() req: FastifyRequest
  ) {
    const validationPipe = new ConvertToVoPipe("booking");
    const bookingVo: BookingVO = await validationPipe.transform(req, { type: 'param', metatype: BookingVO }) as BookingVO;
    console.log(bookingVo)
    return await this.bookingService.displayBooking(bookingVo);
  }

  @Get('guide/:uid/history')
  async displayGuideBookingHistory(
    @Req() req: FastifyRequest
  ) {
    const validationPipe = new ConvertToVoPipe("guide", false, "uid");
    const guideVo: GuideVO = await validationPipe.transform(req, { type: 'param', metatype: GuideVO }) as GuideVO;
    return await this.bookingService.displayGuideBookingHistory(guideVo);
  }

  @Get('tourist/:uid/history')
  async displayTouristBookingHistory(
    @Req() req: FastifyRequest
  ) {
    const validationPipe = new ConvertToVoPipe("tourist", false, "uid");
    const touristVo: TouristVO = await validationPipe.transform(req, { type: 'param', metatype: TouristVO }) as TouristVO;
    return await this.bookingService.displayTouristBookingHistory(touristVo);
  }

  @Get()
  async getAllBooking(
    @Req() req: FastifyRequest
  ) {
    return await this.bookingService.getAllBookings();
  }

  @Get('tour/:tour')
  async getBookingByTour(
    @Req() req: FastifyRequest
  ) {
    req.body = { id: "none" }
    const validationPipe = new ConvertToVoPipe("booking", true, "tour");
    const bookingVo: BookingVO = await validationPipe.transform(req, { type: 'param', metatype: BookingVO }) as BookingVO;
    return await this.bookingService.getBookingsForResource(bookingVo);
  }

  @Get('package/:tourPackage')
  async getBookingByPackage(
    @Req() req: FastifyRequest
  ) {
    req.body = { id: "none" }
    const validationPipe = new ConvertToVoPipe("booking", true, "tourPackage");
    const bookingVo: BookingVO = await validationPipe.transform(req, { type: 'param', metatype: BookingVO }) as BookingVO;
    return await this.bookingService.getBookingsForResource(bookingVo);
  }

  // async makePayment() {}
  // async reserveBooking() {}
}
