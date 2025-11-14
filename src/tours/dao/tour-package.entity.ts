import { Tour } from './tour.entity';

/**
 * TourPackage aggregate
 * - Represents a higher-level grouping of tours into a single package.
 * - Currently not wired into DAO/VO flow, but kept as a conceptual model.
 */
export class TourPackage {
  constructor(
    public id: string,
    public name: string,
    public tours: Tour[], // Tours that belong to this package (already created in tour module).
    public packageName: string, // public packageLocation: List<Location>, // Placeholder for richer location model
    // public packageLocation: List<Location>, // Placeholder for richer location model
    public packagePrice: number,
  ) {}
}
