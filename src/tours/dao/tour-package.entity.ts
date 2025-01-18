import { Tour } from './tour.entity';

export class TourPackage {
  constructor(
    public id: string,
    public name: string,
    public tours: Tour[], // the tours in the package will already be created by the admin in the tour management module.
    public packageName: string,
    //public packageLocation: List<Location>,
    public packagePrice: number,
  ) {}
}
