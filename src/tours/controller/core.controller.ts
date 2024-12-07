import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { TourValidationPipe } from './validation.pipe';
import { TourVO } from '../vo/tour.master.vo';
import { ICoreService } from '../services/tour.service.interface';
import { Tour } from '../dao/tour.entity';
import { Activity } from '../vo/helper.vo';
import { log } from 'console';
import { CORE_SERVICE_TOKEN } from '../token';
import { ResponseObject } from 'src/shared/types';

@Controller('tours')
export class TourController {
  collectionName: string = 'tours';

  // inject firebase repository
  constructor(
    @Inject(CORE_SERVICE_TOKEN) private readonly coreService: ICoreService,
  ) {}

  // tour functions

   // Create a new tour
   @Post()
   async createTour(
     @Body(new TourValidationPipe()) tourVo: TourVO,
   ): Promise<ResponseObject> {
     // process data with service
     return await this.coreService.createTour(tourVo);
   }


  // Get a tour by ID
  // TODO: Validation for when body does not contain id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ResponseObject> {
    return await this.coreService.findTourById(id);
  }

  // Update an existing tour
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new TourValidationPipe('update')) tourVO: TourVO,
  ): Promise<ResponseObject> {
    return await this.coreService.updateTour(id, tourVO);
  }

  // Get all tours
  @Get()
  async findAllTours(): Promise<ResponseObject> {
    return await this.coreService.findAllTours();
  }

  // Delete a tour
  @Delete(':id')
  async deleteTour(@Param('id') id: string): Promise<ResponseObject> {
    return await this.coreService.deleteTour(id);
  }

  // Update tour availability
  @Patch('availability')
  async updateTourAvailability(
    @Body('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ): Promise<ResponseObject> {
       return await this.coreService.updateTourAvailability(id, isAvailable);
  }

  // Assign a guide to a tour
  // TODO: Change guide to guide id in tour entity
  @Patch('assign-guide')
  async assignGuideToTour(
    @Body('tourId') tourId: string,
    @Body('guideId') guideId: string,
  ): Promise<ResponseObject> {
       return await this.coreService.assignGuideToTour(tourId, guideId);
  }

  // activity functions

  // Add an activity to a tour
  @Patch('add-activity')
  async addActivityToTour(
    @Body(new TourValidationPipe('update')) tourVo: TourVO,
  ): Promise<ResponseObject> {
    return await this.coreService.addActivityToTour(tourVo);
  }

  // Remove an activity from a tour
  @Patch('remove-activity')
  async removeActivityFromTour(
    @Body('tourId') tourId: string,
    @Body('activityId') activityId: string,
  ): Promise<ResponseObject> {
    return await this.coreService.removeActivityFromTour(
      tourId,
      activityId,
    );
  }

  // List activities for a tour
  @Get('activities/:tourId')
  async listActivitiesForTour(@Param('tourId') tourId: string): Promise<void> {
    return;
    //return await this.coreService.listActivitiesForTour(tourId);
  }

  // Get the current activity ID
  @Get('current-activity-id')
  async getCurrentActivityId(): Promise<string> {
    // return await this.coreService.getCurrentActivityId();
    return;
  }

  // Set the current activity ID
  @Patch('set-current-activity/:id')
  async setCurrentActivityId(@Param('id') id: string): Promise<string> {
    return;
    //return await this.coreService.setCurrentActivityId(id);
  }

  // Start the current activity
  @Patch('start-current-activity')
  async startCurrentActivity(): Promise<boolean> {
    return;
    //return await this.coreService.startCurrentActivity();
  }

  // Stop the current activity
  @Patch('stop-current-activity')
  async stopCurrentActivity(): Promise<boolean> {
    return;
    //return await this.coreService.stopCurrentActivity();
  }
}
