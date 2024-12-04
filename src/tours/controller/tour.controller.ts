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
<<<<<<< HEAD
import { log } from 'console';
=======
import { CORE_SERVICE_TOKEN } from '../token';
>>>>>>> 58d51cc822486cb88bee200b7a098dd180e0308e

@Controller('tours')
export class TourController {
  collectionName: string = 'tours';

  // inject firebase repository
  constructor(
<<<<<<< HEAD
    @Inject('ICoreService') private readonly coreService: ICoreService,
  ) {}

  // // tour functions
  // @Post()
  // async createTour(
  //   @Body(new TourValidationPipe()) tourVo: TourVO,
  // ): Promise<any> {
  //   // process data with service
  //   return await this.coreService.createTour(tourVo);
  // }

  // @Patch()
  // async update(
  //   @Param() id: string,
  //   @Body(new TourValidationPipe()) tourVO: TourVO,
  // ): Promise<any> {
  //   return await this.coreService.updateTour(id, tourVO);
  // }

  @Get()
  async findById(@Query('id') id: string): Promise<Tour> {
    log(id);
    return await this.coreService.findTourById(id);
  }

  // @Get()
  // async findAllTours(): Promise<Tour[]> {
  //   return;
  // }

  // @Delete()
  // deleteTour(id: string): Promise<void> {
  //   return;
  // }

  // @Patch()
  // updateTourAvailability(id: string, isAvailable: boolean): Promise<boolean>{
  //   return;
  // }

  // @Patch()
  // assignGuideToTour(tourId: string, guideId: string): Promise<void> {
  //   return;
  // }
  
  // // activity functions
  // @Patch()
  // addActivityToTour(tourId: string, activity: Activity): Promise<void> {
  //   return;
  // }

  // @Patch()
  // removeActivityFromTour(tourId: string, activityName: string): Promise<void>{
  //   return;
  // };

  // @Get()
  // listActivitiesForTour(tourId: string): Promise<void> {
  //   return;
  // }

  // @Get()
  // getCurrentActivityId(): Promise<string> {
  //   return;
  // }

  // @Patch()
  // setCurrentActivityId(id: string): Promise<string> {
  //   return;
  // }

  // @Patch()
  // startCurrentActivity(): Promise<boolean> {
  //   return;
  // }

  // @Patch()
  // stopCurrentActivity(): Promise<boolean> {
  //   return;
  // }

=======
    @Inject(CORE_SERVICE_TOKEN) private readonly coreService: ICoreService,
  ) {}

  // tour functions

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
    @Body(new TourValidationPipe()) tourVO: TourVO,
  ): Promise<any> {
    //return await this.coreService.updateTour(id, tourVO);
    return;
  }

  // Get a tour by ID
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Tour> {
    return await this.coreService.findTourById(id);
  }

  // Get all tours
  @Get()
  async findAllTours(): Promise<Tour[]> {
    return;
    //return await this.coreService.findAllTours();
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
  @Patch('add-activity/:tourId')
  async addActivityToTour(
    @Param('tourId') tourId: string,
    @Body() activity: Activity,
  ): Promise<void> {
    return;
    //return await this.coreService.addActivityToTour(tourId, activity);
  }

  // Remove an activity from a tour
  @Patch('remove-activity/:tourId')
  async removeActivityFromTour(
    @Param('tourId') tourId: string,
    @Body('activityName') activityName: string,
  ): Promise<void> {
    // return await this.coreService.removeActivityFromTour(
    //   tourId,
    //   activityName,
    // );
    return;
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
>>>>>>> 58d51cc822486cb88bee200b7a098dd180e0308e
}
