import { CreateTourDTO } from 'src/tours/controller/dto/tour.create.dto';
import { UpdateTourDTO } from 'src/tours/controller/dto/tour.update.dto';
import { Activity } from '../vo/helper.vo';
import { Tour } from '../dao/tour.entity';
import { TourVO } from '../vo/tour.master.vo';
import { ResponseObject } from 'src/shared/types';

export interface ICoreService {
  // tour functions
  createTour(tourVO: TourVO): Promise<ResponseObject>;
  updateTour(id: string, tourVO: TourVO): Promise<ResponseObject>;
  findTourById(id: string): Promise<ResponseObject>;
  findAllTours(): Promise<ResponseObject>;
  deleteTour(id: string): Promise<ResponseObject>;
  updateTourAvailability(id: string, isAvailable: boolean): Promise<ResponseObject>;
  assignGuideToTour(tourId: string, guideId: string): Promise<ResponseObject>

  // activity functions
  addActivityToTour(tourVo: TourVO): Promise<ResponseObject>;
  removeActivityFromTour(tourId: string, activityId: string): Promise<ResponseObject>;
  listActivitiesForTour(tourId: string): Promise<ResponseObject>;
  getCurrentActivityId(): Promise<string>;
  setCurrentActivityId(id: string): Promise<string>;
  startCurrentActivity(): Promise<boolean>;
  stopCurrentActivity(): Promise<boolean>;
}
