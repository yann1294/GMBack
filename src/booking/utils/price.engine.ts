import { Package } from "src/tours/dao/package.entity";
import { Tour } from "src/tours/dao/tour.entity";

export class PriceEngine {
  private resource: Tour | Package;
  constructor(resource: Tour | Package) {
    this.resource = resource;
  }

  totalPrice(): number {
    return Math.random();
  }
  applyDiscount(): number {
    return Math.random();
  }
  calculateTax(): number {
    return Math.random();
  }
}
// TODO: Figure out where to do with this
