import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TourValidationPipe } from './validation.pipe';
import { TourVO } from '../vo/tour.master.vo';
import { ICoreService } from '../services/tour.service.interface';
import { Tour } from '../dao/tour.entity';
import { Activity } from '../vo/helper.vo';

@Controller('tours')
export class TourController {
  collectionName: string = 'tours';

  // inject firebase repository
  constructor(
    private readonly coreService: ICoreService,
  ) {}

  // tour functions
  @Post()
  async createTour(
    @Body(new TourValidationPipe()) tourVo: TourVO,
  ): Promise<any> {
    // process data with service
    return await this.coreService.createTour(tourVo);
  }

  @Patch()
  async update(@Param() id: string, @Body(new TourValidationPipe()) tourVO: TourVO): Promise<any> {
    return await this.coreService.updateTour(id, tourVO);
  }

  @Get()
  async findById(@Param() id: string): Promise<Tour> {
    return await this.coreService.findTourById(id);
  }

  @Get()
  async findAllTours(): Promise<Tour[]> {
    return;
  }

  @Delete()
  deleteTour(id: string): Promise<void> {
    return;
  }

  @Patch()
  updateTourAvailability(id: string, isAvailable: boolean): Promise<boolean>{
    return;
  }

  @Patch()
  assignGuideToTour(tourId: string, guideId: string): Promise<void> {
    return;
  }
  
  // activity functions
  @Patch()
  addActivityToTour(tourId: string, activity: Activity): Promise<void> {
    return;
  }

  @Patch()
  removeActivityFromTour(tourId: string, activityName: string): Promise<void>{
    return;
  };

  @Get()
  listActivitiesForTour(tourId: string): Promise<void> {
    return;
  }

  @Get()
  getCurrentActivityId(): Promise<string> {
    return;
  }

  @Patch()
  setCurrentActivityId(id: string): Promise<string> {
    return;
  }

  @Patch()
  startCurrentActivity(): Promise<boolean> {
    return;
  }

  @Patch()
  stopCurrentActivity(): Promise<boolean> {
    return;
  }

}
