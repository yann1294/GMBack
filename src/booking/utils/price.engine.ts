import { Package } from 'src/tours/dao/package.entity';
import { Tour } from 'src/tours/dao/tour.entity';

/**
 * PriceEngine
 * - Encapsulates pricing logic for Tour or Package.
 * - TODO: replace stubbed random implementations with real calculation.
 */
export class PriceEngine {
  private resource: Tour | Package;
  constructor(resource: Tour | Package) {
    this.resource = resource;
  }

  // Compute total price (currently stubbed)
  totalPrice(): number {
    return Math.random();
  }
  // Apply discounts (currently stubbed)
  applyDiscount(): number {
    return Math.random();
  }
  // Calculate tax (currently stubbed)
  calculateTax(): number {
    return Math.random();
  }
}
// TODO: Figure out where to do with this
