import { Inject, Injectable } from "@nestjs/common";
import { BOOKING_DAO_INTERFACE_TOKEN, BOOKING_SERVICE_TOKEN } from "../token";
import IBookingDAO from "../dao/booking.dao.interface";
import { ResponseObject } from "src/shared/types";
import { BookingStatus } from "./consts.utils";
import { Booking } from "../dao/booking.entity";
import { Tour } from "src/tours/dao/tour.entity";
import { Package } from "src/tours/dao/package.entity";
import { PriceEngine } from "./price.engine";

// TODO: Comes from User management and Tour management
@Injectable()
export class InventoryManagement {
  constructor(
    @Inject(BOOKING_DAO_INTERFACE_TOKEN) private readonly bookingDAO: IBookingDAO
  ){}
  getGuideAvailability() {}
  updateGuideAvailability() {}
  getTourAvailability() {}
  updateTourAvailability() {}

  getDate(){}

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<ResponseObject> {
    return await this.bookingDAO.update({ id: bookingId, status: status } as Booking);
  }
  
  async getAvailability(resourceId: string): Promise<boolean> {
    // fetch booking
    let response = await this.bookingDAO.findByCondition([{
      fieldPath: "resourceId",
      value: resourceId,
      operationString: "=="
    },{
      fieldPath: "status",
      value: "in-process",
      operationString: "=="
    }]);

    // if data is null then tour is not available
    if (response.data === null) {
      return false;
    }
    return true;
  }

  // Calls total price from price engine. Total price uses apply discount and returns total price with discount.
  async computePrice(resourceType: string, resourceId: string): Promise<ResponseObject> {
    // get resource
    const resource = await this.bookingDAO.findResource(resourceType, resourceId);
    if (resource.status !== "success") return resource;

    // compute price using price engine
    let priceEngine = new PriceEngine(resource.data as any);

    return {
      status: "success",
      code: 200,
      message: "Price computed",
      data: priceEngine.totalPrice(),
    };
  }

  checkCapacity() {}
  manageResources() {}
 
}