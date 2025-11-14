import { ICoreService } from './tour.core.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Tour } from '../dao/tour.entity';
import { TourVO } from '../vo/tour.master.vo';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';
import { CORE_DAO_INTERFACE_TOKEN } from '../token';
import { plainToClass } from 'class-transformer';
import { Activity } from '../vo/helper.vo';
import { FieldValue } from 'firebase-admin/firestore';
import { ResponseObject } from 'src/shared/types';
import { MultipartFile } from '@fastify/multipart';

@Injectable()
export class CoreService implements ICoreService {
  // Inject DAO via the DI token for loose coupling
  constructor(
    @Inject(CORE_DAO_INTERFACE_TOKEN)
    private readonly coreDAO: CoreDAOInterface,
  ) {}

  /**
   * Create a new tour from VO.
   */
  async createTour(tourVo: TourVO): Promise<ResponseObject> {
    // converting VO to Entity and returning entity
    return await this.coreDAO.create(tourVo.toEntity());
  }

  /**
   * Update an entire tour entity.
   * (Here the caller provides an already-built Tour entity.)
   */
  async updateTour(tourVo: Tour): Promise<ResponseObject> {
    return await this.coreDAO.update(tourVo);
  }

  /**
   * Find a tour by id using VO as carrier.
   */
  async findTourById(tourVo: TourVO): Promise<ResponseObject> {
    return await this.coreDAO.findById(tourVo.toEntity());
  }
  /**
   * Retrieve all tours.
   */
  async findAllTours(): Promise<ResponseObject> {
    return await this.coreDAO.findAll();
  }
  /**
   * Delete a tour completely.
   */
  async deleteTour(tourVo: TourVO): Promise<ResponseObject> {
    return await this.coreDAO.delete(tourVo.toEntity());
  }
  /**
   * Update tour availability (and any other fields present on the VO).
   */
  async updateTourAvailability(tourVo: TourVO): Promise<ResponseObject> {
    return await this.coreDAO.update(tourVo.toEntity());
  }

  /**
   * Assign or update the guide for a tour.
   */
  async assignGuideToTour(tourVo: TourVO): Promise<ResponseObject> {
    return await this.coreDAO.update(tourVo.toEntity());
  }

  /**
   * Add or modify the activities map on a tour.
   * Entire VO is converted to entity and persisted.
   */
  async addActivityToTour(tourVo: TourVO): Promise<ResponseObject> {
    const tourEntity = tourVo.toEntity();
    console.log('SERVICE → tourEntity.activities', tourEntity.activities);
    return await this.coreDAO.update(tourEntity);
  }

  /**
   * Remove activities from a tour.
   * Current implementation deletes the whole tour after marking activities for deletion.
   * TODO: refine to only perform logical deletion of activities.
   */
  async removeActivityFromTour(tourVo: TourVO): Promise<ResponseObject> {
    for (const activityId in tourVo.activities) {
      tourVo.activities[activityId] = FieldValue.delete();
    }
    return await this.coreDAO.delete(tourVo.toEntity());
  }

  /**
   * Return only the activities of a given tour.
   */
  async listActivitiesForTour(tourVo: TourVO): Promise<ResponseObject> {
    // fetch tour with id == tourId
    let response: ResponseObject = await this.coreDAO.findById(
      tourVo.toEntity(),
    );
    if (response.status !== 'success') {
      return response;
    }
    // Override data with only the activities collection
    return {
      ...response,
      data: response.data['activities'] as Activity[],
    } as ResponseObject;
  }

  // TODO: Will operate on a booking session and not the entire tour entity
  // Activity session management (not yet implemented)
  getCurrentActivityId(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  setCurrentActivityId(id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  startCurrentActivity(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  stopCurrentActivity(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
