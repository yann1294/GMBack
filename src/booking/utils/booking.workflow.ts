import { Inject, Injectable } from '@nestjs/common';
import { InventoryManagement } from './inventory.management';
import IBookingService from '../services/booking.service.interface';
import { BookingVO } from '../vo/booking.master.vo';
import { PaymentVO } from 'src/payment/vo/payment.master.vo';
import { PaymentWorkflow } from 'src/payment/utils/payment.workflow';
import { BOOKING_SERVICE_TOKEN } from '../token';
import { ResponseObject } from 'src/shared/types';

/**
 * BookingWorkflow
 * - Orchestrates the end-to-end booking process:
 *   1) Check availability
 *   2) Compute price
 *   3) Create booking
 *   4) Execute payment workflow
 */
@Injectable()
export class BookingWorkflow {
  constructor(
    @Inject(BOOKING_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
    private readonly inventoryManagement: InventoryManagement,
    private readonly payment: PaymentWorkflow,
  ) {}

  /**
   * Execute the complete booking workflow for a given BookingVO.
   */
  async executeBooking(bookingVo: BookingVO): Promise<ResponseObject> {
    let bookingEntity = bookingVo.toEntity();

    // Step 1: Check tour/package availability via InventoryManagement
    const isAvailable = await this.inventoryManagement.getAvailability(
      bookingEntity.resourceId,
    );
    if (!isAvailable) {
      return {
        status: 'failure',
        code: 404,
        message: 'Resource not available for booking',
        data: null,
      };
    }

    // Step 2: Calculate price for the given resource
    const price = await this.inventoryManagement.computePrice(
      bookingEntity.bookingType,
      bookingEntity.resourceId,
    );

    // Step 3: Persist the booking entity using BookingService
    const booking = await this.bookingService.makeBooking(bookingVo);

    // Step 4: Call payment workflow (delegated to Payment container)
    // // NOTE: PaymentVO is currently instantiated empty and should be
    // populated with `price` and booking info as implementation evolves.
    //const payment = await this.payment.executePayment(new PaymentVO());

    // Final response combining booking + payment results
    return {
      status: 'success',
      code: 200,
      message: 'Booking successfully completed',
      data: {
        booking,
        payment: null,
      },
    };
  }
}
