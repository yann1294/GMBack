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
  Req,
  Request,
} from '@nestjs/common';
import { TourValidationPipe } from './core.validation.pipe';
import { TourVO } from '../vo/tour.master.vo';
import { ICoreService } from '../services/tour.core.service.interface';
import { Tour } from '../dao/tour.entity';
import { Activity } from '../vo/helper.vo';
import { log } from 'console';
import { CORE_SERVICE_TOKEN } from '../token';
import { ResponseObject } from 'src/shared/types';
import { HasAttribute } from 'src/shared/pipes/has-attribute.pipe';
import { ConvertToVoPipe } from 'src/shared/pipes/convert-to-vo.pipe';
import { FastifyRequest } from 'fastify';
import { deleteImage, uploadImages } from '../utils/upload-images.util';

@Controller('tours')
export class TourController {
  collectionName: string = 'tours';

  // inject firebase repository
  constructor(
    @Inject(CORE_SERVICE_TOKEN) private readonly coreService: ICoreService,
  ) {}

  // tour functions

   // Create a new tour
   @Post("create")
   async createTour(
     @Body(new TourValidationPipe()) tourVo: TourVO,
   ): Promise<ResponseObject> {
     // process data with service
     return await this.coreService.createTour(tourVo);
   }


  // Get a tour by ID
  @Get(':id')
  async findById(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe("tour", false, "id");
    const tourVo: TourVO = await validationPipe.transform(req, { type: 'param', metatype: TourVO }) as TourVO;
    return await this.coreService.findTourById(tourVo);
  }

  // Update an existing tour
  @Patch("update")
  async update(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe("tour", true, "id");
    const tourVo: TourVO = await validationPipe.transform(req, { type: 'param', metatype: TourVO }) as TourVO;
    return await this.coreService.updateTour(tourVo);
  }

  // Get all tours
  @Get()
  async findAllTours(): Promise<ResponseObject> {
    return await this.coreService.findAllTours();
  }

  // Delete a tour
  @Delete('delete')
  async Delete(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe("tour", true, "id");
    const tourVo: TourVO = await validationPipe.transform(req, { type: 'param', metatype: TourVO }) as TourVO;
    return await this.coreService.deleteTour(tourVo);
  }

  // Assign a guide to a tour
  @Patch('assign-guide')
  async assignGuideToTour(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe("package", true);
    const tourVo: TourVO = await validationPipe.transform(req, { type: 'param', metatype: TourVO }) as TourVO;
    return this.coreService.assignGuideToTour(tourVo);
  }

  @Patch('availability')
  async updateTourAvailability(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe("package", true);
    const tourVo: TourVO = await validationPipe.transform(req, { type: 'param', metatype: TourVO }) as TourVO;
    return this.coreService.updateTourAvailability(tourVo);
  }

  // upload an image for a tour
  @Post('upload-image/:tourId/')
  async uploadImage(@Req() req: FastifyRequest): Promise<ResponseObject> {
    return await uploadImages(req.params['tourId'], req.files(), 'tours');
  }

  // Delete an image for a tour
  @Delete('delete-image')
  async deleteImage(@Body(new HasAttribute(['tourId', 'image'])) body: { tourId: string, image: string}): Promise<ResponseObject> {
    return await deleteImage(body.tourId, body.image, 'tours');
  }

  // Add an activity to a tour
  @Patch('add-activity')
  async addActivityToTour(
    @Body(new TourValidationPipe('update')) tourVo: TourVO,
  ): Promise<ResponseObject> {
    return await this.coreService.addActivityToTour(tourVo);
  }

  // Remove an activity from a tour
  @Patch('remove-activity')
  async removeActivityFromTour(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe("package", true);
    const tourVo: TourVO = await validationPipe.transform(req, { type: 'param', metatype: TourVO }) as TourVO;
    return await this.coreService.removeActivityFromTour(tourVo);
  }

  // List activities for a tour
  @Get('activities/:id')
  async listActivitiesForTour(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe("package", false);
    const tourVo: TourVO = await validationPipe.transform(req, { type: 'param', metatype: TourVO }) as TourVO;
    return await this.coreService.listActivitiesForTour(tourVo);
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
