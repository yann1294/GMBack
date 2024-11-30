import { CreateTourDTO } from "src/tours/controller/dto/tour.create.dto";
import { UpdateTourDTO } from "src/tours/controller/dto/tour.update.dto";
import { Activity } from "../vo/helper.vo";
import { Tour } from "../dao/tour.entity";
import { TourVO } from "../vo/tour.master.vo";

export interface ICoreService {
  // tour functions
  createTour(tourVO: TourVO): Promise<void>;
  updateTour(id: string, tourVO: TourVO): Promise<void>;
  findTourById(id: string): Promise<Tour>;
  findAllTours(): Promise<Tour[]>;
  deleteTour(id: string): Promise<void>;
  // updateTourAvailability(id: string, isAvailable: boolean): Promise<boolean>;
  // assignGuideToTour(tourId: string, guideId: string): Promise<void>
  
  // // activity functions
  // addActivityToTour(tourId: string, activity: Activity): Promise<void>;
  // removeActivityFromTour(tourId: string, activityName: string): Promise<void>;
  // listActivitiesForTour(tourId: string): Promise<void>;
  // getCurrentActivityId(): Promise<string>;
  // setCurrentActivityId(id: string): Promise<string>;
  // startCurrentActivity(): Promise<boolean>;
  // stopCurrentActivity(): Promise<boolean>;
}