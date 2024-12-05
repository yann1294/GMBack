import { ICoreService } from './tour.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Tour } from '../dao/tour.entity';
import { TourVO } from '../vo/tour.master.vo';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';

import { CORE_DAO_INTERFACE_TOKEN } from '../token';
import { plainToClass } from 'class-transformer';
import { UpdateTourDTO } from '../controller/dto/tour.update.dto';
import { Activity } from '../vo/helper.vo';

@Injectable()
export class CoreService implements ICoreService {
  constructor(
    @Inject(CORE_DAO_INTERFACE_TOKEN)
    private readonly coreDAO: CoreDAOInterface,
  ) {}

  async createTour(tourVO: TourVO): Promise<void> {
    // converting VO to Entity and returning entity
    return await this.coreDAO.create(tourVO.toEntity());
  }

  async updateTour(id: string, updateTourDTO: TourVO): Promise<void> {
    const tourVO = plainToClass(TourVO, updateTourDTO);
    const updatedData = tourVO.toEntity();
    return await this.coreDAO.update(id, updatedData);
  }

  async findTourById(id: string): Promise<Tour> {
    return await this.coreDAO.findById(id);
  }
  async findAllTours(): Promise<Tour[]> {
    return await this.coreDAO.findAll();
  }
  async deleteTour(id: string): Promise<void> {
    return await this.coreDAO.delete(id);
  }
  async updateTourAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<boolean> {
    const updateData: UpdateTourDTO = { isAvailable };
    return await this.coreDAO.update(id, updateData);
  }

  async assignGuideToTour(tourId: string, guideId: string): Promise<void> {
    const tour = await this.coreDAO.findById(tourId);
    if (!tour) {
      throw new Error(`Tour with ID ${tourId} not found.`);
    }
    tour.guide = guideId;
    await this.coreDAO.update(tourId, tour);
  }
  async addActivityToTour(tourId: string, activity: Activity): Promise<void> {
    // Step 1: Retrieve the tour
    const tour = await this.coreDAO.findById(tourId);
    if (!tour) {
      throw new Error(`Tour with ID ${tourId} not found.`);
    }

    // Step 2: Add the activity
    if (!tour.activities) {
      tour.activities = [];
    }
    tour.activities.push(activity);

    // Step 3: Update the tour
    await this.coreDAO.update(tourId, tour);
  }
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
