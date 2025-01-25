import { Injectable } from "@nestjs/common";

// TODO: Comes from User management and Tour management
@Injectable()
export class InventoryManagement {
  getGuideAvailability() {}
  updateGuideAvailability() {}
  getTourAvailability() {}
  updateTourAvailability() {}

  getDate(){}
  updateBookingStatus() {}
  getAvailability(tourId: string): boolean {
    return true;
  }

  computePrice(tourId: string) {}
  // Calls total price from price engine. Total price uses apply discount and returns total price with discount.
  checkCapacity() {}
  manageResources() {}
 
}