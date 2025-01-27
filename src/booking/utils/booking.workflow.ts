import { Inject, Injectable } from "@nestjs/common";
import { InventoryManagement } from "./inventory.management";
import IBookingService from "../services/booking.service.interface";
import { BookingVO } from "../vo/booking.master.vo";
import { PaymentVO } from "src/payment/vo/payment.master.vo";
import { PaymentWorkflow } from "src/payment/utils/payment.workflow";
import { BOOKING_SERVICE_TOKEN } from "../token";
import { ResponseObject } from "src/shared/types";

@Injectable()
export class BookingWorkflow {
  constructor(
   @Inject(BOOKING_SERVICE_TOKEN) private readonly bookingService: IBookingService,
    private readonly inventoryManagement: InventoryManagement,
    private readonly payment: PaymentWorkflow,
) {}

  async executeBooking(bookingVo: BookingVO): Promise<ResponseObject> {
    let bookingEntity = bookingVo.toEntity();

    // Step 1: Check tour availability
    const isAvailable = await this.inventoryManagement.getAvailability(bookingEntity.resourceId);
    if (!isAvailable) {
      return {
        status: "failure",
        code: 404,
        message: "Resource not available for booking",
        data: null
      }
    }

    // Step 2: Calculate price
    const price = await this.inventoryManagement.computePrice(bookingEntity.bookingType, bookingEntity.resourceId);

    // Step 3: Create booking
    const booking = await this.bookingService.makeBooking(bookingVo);

    // Step 4: call payment workflow (should come from external container - payment)
    const payment = await this.payment.executePayment(new PaymentVO());

    // Return booking details
    return {
      status: "success",
      code: 200,
      message: "Booking successfully completed",
      data: {
        booking,
        payment,
      },
    };
  }
}
