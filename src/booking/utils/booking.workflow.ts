import { Injectable } from "@nestjs/common";
import { InventoryManagement } from "./inventory.management";
import IBookingService from "../services/booking.service.interface";
import { BookingVO } from "../vo/booking.master.vo";
import { PaymentVO } from "src/payment/vo/payment.master.vo";
import { PaymentWorkflow } from "src/payment/utils/payment.workflow";

@Injectable()
export class BookingWorkflow {
  constructor(
    private readonly bookingService: IBookingService,
    private readonly inventoryManagement: InventoryManagement,
    private readonly payment: PaymentWorkflow,
) {}

  async executeBooking(bookingVo: BookingVO): Promise<any> {
    let resourceId = bookingVo.toEntity().resourceId;
    // Step 1: Check tour availability
    const isAvailable = await this.inventoryManagement.getAvailability(resourceId);
    if (!isAvailable) {
      throw new Error('Tour not available');
    }

    // Step 2: Calculate price
    const price = await this.inventoryManagement.computePrice(resourceId);

    // Step 3: Create booking
    const booking = await this.bookingService.makeBooking(new BookingVO());

    // Step 4: call payment workflow (should come from external container - payment)
    const payment = await this.payment.executePayment(new PaymentVO());
    
    // Return booking details
    return {
      payment
    };
  }
}
