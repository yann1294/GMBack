import { Inject, Injectable } from '@nestjs/common';
import { BOOKING_DAO_INTERFACE_TOKEN, BOOKING_SERVICE_TOKEN } from '../token';
import IBookingDAO from '../dao/booking.dao.interface';
import { ResponseObject } from 'src/shared/types';
import { BookingStatus } from './consts.utils';
import { Booking } from '../dao/booking.entity';
import { Tour } from 'src/tours/dao/tour.entity';
import { Package } from 'src/tours/dao/package.entity';
import { PriceEngine } from './price.engine';

// TODO: Comes from User management and Tour management
@Injectable()
/**
 * InventoryManagement
 * - Responsible for availability checks, pricing, capacity and resource updates.
 */
export class InventoryManagement {
  constructor(
    @Inject(BOOKING_DAO_INTERFACE_TOKEN)
    private readonly bookingDAO: IBookingDAO,
  ) {}
  // Placeholder methods for guide/tour availability lifecycle
  getGuideAvailability() {}
  updateGuideAvailability() {}
  getTourAvailability() {}
  updateTourAvailability() {}

  getDate() {}

  /**
   * Update the booking status field for a given booking.
   */
  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<ResponseObject> {
    return await this.bookingDAO.update({
      id: bookingId,
      status: status,
    } as Booking);
  }
  /**
   * Check if a resource is available based on existing bookings.
   * Currently:
   * - Queries bookings with resourceId and status "in-process".
   * - Returns false if no such bookings exist, true otherwise.
   */
  async getAvailability(resourceId: string): Promise<boolean> {
    // Fetch bookings matching resourceId + "in-process" status
    let response = await this.bookingDAO.findByCondition([
      {
        fieldPath: 'resourceId',
        value: resourceId,
        operationString: '==',
      },
      {
        fieldPath: 'status',
        value: 'in-process',
        operationString: '==',
      },
    ]);

    // If data is null then no matching bookings were found
    if (response.data === null) {
      return false;
    }
    return true;
  }

  /**
   * Compute total price for a tour or package.
   * - Loads the resource via BookingDAO.
   * - Delegates pricing logic to PriceEngine.
   */
  async computePrice(
    resourceType: string,
    resourceId: string,
  ): Promise<ResponseObject> {
    // Load resource (Tour or Package)
    const resource = await this.bookingDAO.findResource(
      resourceType,
      resourceId,
    );
    if (resource.status !== 'success') return resource;

    // Compute price using pricing engine (currently stubbed)
    let priceEngine = new PriceEngine(resource.data as any);

    return {
      status: 'success',
      code: 200,
      message: 'Price computed',
      data: priceEngine.totalPrice(),
    };
  }

  // Stubs for future capacity and resource management
  checkCapacity() {}
  manageResources() {}
}
