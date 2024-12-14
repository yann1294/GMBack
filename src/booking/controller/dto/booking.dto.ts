import { Package } from "src/tours/dao/package.entity";
import { Tour } from "src/tours/dao/tour.entity";
import { User } from "src/tours/vo/helper.vo";

class BookingDTO {
    private id: string;
  private status: string;
  private bookedOn: Date;
  private tourist: string[];
  private tour: string;
  private tourPackage: string;
}