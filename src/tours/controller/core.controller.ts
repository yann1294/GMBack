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
} from '@nestjs/common';
import { TourValidationPipe } from './validation.pipe';
import { TourVO } from '../vo/tour.master.vo';
import { ICoreService } from '../services/tour.service.interface';
import { Tour } from '../dao/tour.entity';
import { Activity } from '../vo/helper.vo';
import { log } from 'console';
import { CORE_SERVICE_TOKEN } from '../token';

@Controller('tours')
export class TourController {
  collectionName: string = 'tours';

  // inject firebase repository
  constructor(
    @Inject(CORE_SERVICE_TOKEN) private readonly coreService: ICoreService,
  ) {}

  // tour functions

  // Get a tour by ID
  // TODO: Validation for when body does not contain id
  @Get('find-by-id')
  async findById(@Param('id') id: string): Promise<Tour> {
    console.log("Find by id");
    log(id);
    return await this.coreService.findTourById(id);
  }

  // Create a new tour
  @Post()
  async createTour(
    @Body(new TourValidationPipe()) tourVo: TourVO,
  ): Promise<any> {
    // process data with service
    return await this.coreService.createTour(tourVo);
  }

  // Update an existing tour
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new TourValidationPipe('update')) tourVO: TourVO,
  ): Promise<any> {
    console.log(tourVO);
    return await this.coreService.updateTour(id, tourVO);
  }

  // Get all tours
  @Get()
  async findAllTours(): Promise<Tour[]> {
    return await this.coreService.findAllTours();
  }

  // Delete a tour
  @Delete(':id')
  deleteTour(@Param('id') id: string): Promise<void> {
    return;
    //return await this.coreService.deleteTour(id);
  }

  // Update tour availability
  @Patch('availability/:id')
  async updateTourAvailability(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ): Promise<boolean> {
    return;
    //    return await this.coreService.updateTourAvailability(id, isAvailable);
  }

  // Assign a guide to a tour
  @Patch('assign-guide/:tourId')
  async assignGuideToTour(
    @Param('tourId') tourId: string,
    @Body('guideId') guideId: string,
  ): Promise<void> {
    return;
    //    return await this.coreService.assignGuideToTour(tourId, guideId);
  }

  // activity functions

  // Add an activity to a tour
  @Patch('add-activity')
  async addActivityToTour(
    @Body('tourId') tourId: string,
    @Body(new TourValidationPipe('update')) tourVo: TourVO,
  ): Promise<void> {
    return await this.coreService.addActivityToTour(tourId, tourVo);
  }

  // Remove an activity from a tour
  @Patch('remove-activity')
  async removeActivityFromTour(
    @Body('tourId') tourId: string,
    @Body('activityId') activityId: string,
  ): Promise<void> {
    console.log(tourId);
    console.log(activityId);
    
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
