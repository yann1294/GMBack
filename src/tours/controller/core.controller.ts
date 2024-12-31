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
import { TourValidationPipe } from './core.validation.pipe';
import { TourVO } from '../vo/tour.master.vo';
import { ICoreService } from '../services/tour.service.interface';
import { Tour } from '../dao/tour.entity';
import { Activity } from '../vo/helper.vo';
import { log } from 'console';
import { CORE_SERVICE_TOKEN } from '../token';
import { ResponseObject } from 'src/shared/types';
import { HasAttribute } from 'src/shared/pipes/has-attribute.pipe';

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
    @Body(new HasAttribute(['isAvailable', 'tourId'])) body: {tourId: string, isAvailable: boolean},
  ): Promise<ResponseObject> {
       return await this.coreService.updateTourAvailability(body.tourId, body.isAvailable);
  }

  // Assign a guide to a tour
  @Patch('assign-guide')
  async assignGuideToTour(
    @Body(new HasAttribute(['tourId', 'guideId'])) body: {tourId: string, guideId: string},
  ): Promise<ResponseObject> {
       return await this.coreService.assignGuideToTour(body.tourId, body.guideId);
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
    @Body(new HasAttribute(['tourId', 'activityId'])) body: {tourId: string, activityId: string},
  ): Promise<ResponseObject> {
    return await this.coreService.removeActivityFromTour(
      body.tourId,
      body.activityId,
    );
  }

  // List activities for a tour
  @Get('activities/:tourId')
  async listActivitiesForTour(@Param('tourId') tourId: string): Promise<ResponseObject> {
    return await this.coreService.listActivitiesForTour(tourId);
  }

  // Get the current activity ID
  // TODO: Will be implemented when booking container is implemented
  // TODO: Implement booking session
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
