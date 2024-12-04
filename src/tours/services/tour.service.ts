import { ICoreService } from './tour.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Tour } from '../dao/tour.entity';
import { TourVO } from '../vo/tour.master.vo';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';



@Injectable()
export class CoreService implements ICoreService {
  constructor(
    @Inject('CoreDAOInterface') private readonly coreDAO: CoreDAOInterface,
  ) {}

  async createTour(tourVO: TourVO): Promise<void> {
    // converting VO to Entity and returning entity
    // return await this.coreDAO.create(tourVO.toEntity());
  }
  async updateTour(id: string, tourVO: TourVO): Promise<void> {
    // return await this.coreDAO.update(id, tourVO);
    return;
  }
 
  async findTourById(id: string): Promise<Tour> {
    return await this.coreDAO.findById(id);
  }
  async findAllTours(): Promise<Tour[]> {
    // return await this.coreDAO.findAll();
    return;
  }
  async deleteTour(id: string): Promise<void> {
    // return await this.coreDAO.delete(id);
  }
  // async updateTourAvailability(id: string, isAvailable: boolean): boolean {
  //   return await this.coreDAO.update(id, isAvailable);
  // }
  // async assignGuideToTour(tourId: string, guideId: string): void {
  //   return await this.coreDAO.findById(tourId, guideId)
  // }
  // async addActivityToTour(tourId: string, activity: Activity): void {
  //   return await this.coreDAO.create(tourId, activity)
  // }
  // async removeActivityFromTour(tourId: string, activityName: string): void {
  //   return await this.coreDAO.delete(tourId, activityName)
  // }
  // async listActivitiesForTour(tourId: string): void {
  //   return this.coreDAO.findById(tourId)
  // }
  // async getCurrentActivityId(id: string): string {
  //   return this.coreDAO.findById(id)
  // }
  // async setCurrentActivityId(id: string): string {
  //   return this.coreDAO.update(id)
  // }
  // async startCurrentActivity(): boolean {
  //   throw new Error('Method not implemented.');
  // }
  // async stopCurrentActivity(): boolean {
  //   throw new Error('Method not implemented.');
  // }



}