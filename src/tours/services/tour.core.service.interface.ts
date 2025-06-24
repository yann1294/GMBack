import { CreateTourDTO } from 'src/tours/controller/dto/tour.create.dto';
import { UpdateTourDTO } from 'src/tours/controller/dto/tour.update.dto';
import { Activity } from '../vo/helper.vo';
import { Tour } from '../dao/tour.entity';
import { TourVO } from '../vo/tour.master.vo';
import { ResponseObject } from 'src/shared/types';
import { MultipartFile } from '@fastify/multipart';

export interface ICoreService {
  // tour functions
  createTour(tourVO: TourVO): Promise<ResponseObject>;
  updateTour(tourVO: Tour): Promise<ResponseObject>;
  findTourById(tourVO: TourVO): Promise<ResponseObject>;
  findAllTours(): Promise<ResponseObject>;
  deleteTour(tourVO: TourVO): Promise<ResponseObject>;
  updateTourAvailability(tourVO: TourVO): Promise<ResponseObject>;
  assignGuideToTour(tourVO: TourVO): Promise<ResponseObject>;

  // activity functions
  addActivityToTour(tourVo: TourVO): Promise<ResponseObject>;
  removeActivityFromTour(tourVo: TourVO): Promise<ResponseObject>;
  listActivitiesForTour(tourVo: TourVO): Promise<ResponseObject>;
  getCurrentActivityId(): Promise<string>;
  setCurrentActivityId(id: string): Promise<string>;
  startCurrentActivity(): Promise<boolean>;
  stopCurrentActivity(): Promise<boolean>;
}
