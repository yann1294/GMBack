import {
  BadRequestException,
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
  UsePipes,
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
import { ImageManager } from '../utils/upload-images.util';
import { FileDTO } from 'src/user-management/controller/dto/helper.dto';

@Controller('tours')
export class TourController {
  // Firestore collection name used consistently for tours
  collectionName: string = 'tours';

  constructor(
    // Inject the core tour service via its token to keep controller decoupled
    @Inject(CORE_SERVICE_TOKEN) private readonly coreService: ICoreService,
    // Handles upload + persistence of images for tours
    private readonly imageManager: ImageManager,
  ) {}
  /**
   * POST /tours/images
   * Handle multipart image uploads for tours.
   * Delegates all file handling and persistence to ImageManager.
   */
  @Post('images')
  async uploadImage(@Req() req: FastifyRequest): Promise<ResponseObject> {
    // Uploading images
    return await this.imageManager.uploadImages(req, 'tours');
  }

  /**
   * POST /tours
   * Create a new tour.
   * Body is validated and transformed into TourVO by TourValidationPipe.
   */
  @Post()
  async createTour(
    @Body(new TourValidationPipe()) tourVo: TourVO,
  ): Promise<ResponseObject> {
    console.log('API Entry: POST /tours', { body: tourVo });
    return await this.coreService.createTour(tourVo);
  }

  /**
   * GET /tours/:id
   * Fetch a tour by id.
   * ConvertToVoPipe builds a TourVO from the Fastify request (params).
   */
  @Get(':id')
  async findById(@Req() req: FastifyRequest): Promise<ResponseObject> {
    console.log('API Entry: GET /tours/:id', { params: req.params });
    const validationPipe = new ConvertToVoPipe('tour', false, 'id');
    const tourVo: TourVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TourVO,
    })) as TourVO;
    return await this.coreService.findTourById(tourVo);
  }

  /**
   * PATCH /tours/:id
   * Update a tour (partial or full).
   * ConvertToVoPipe('update') produces a TourVO with updated fields.
   * The VO is converted to an Entity, then to a Firestore update payload.
   */
  @Patch(':id')
  async update(@Req() req: FastifyRequest): Promise<ResponseObject> {
    console.log('API Entry: PATCH /tours', { params: req.params });
    const validationPipe = new ConvertToVoPipe('tour', true, 'id', 'update');
    const tourVo: TourVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TourVO,
    })) as TourVO;
    // Convert VO→Entity, then log the final plain object:
    // Convert VO → Entity, then log final plain object before persisting
    const entity = tourVo.toEntity();
    console.log('SERVICE → tourEntity.activities', entity.activities);
    console.log('🔍 will write to Firestore:', entity.toUpdateObject());
    return await this.coreService.updateTour(entity);
  }

  /**
   * GET /tours
   * Return all tours.
   */
  @Get()
  async findAllTours(): Promise<ResponseObject> {
    console.log('API Entry: GET /tours');
    return await this.coreService.findAllTours();
  }

  /**
   * DELETE /tours/:id
   * Delete a tour by id.
   */
  @Delete(':id')
  async Delete(@Req() req: FastifyRequest): Promise<ResponseObject> {
    console.log('API Entry: DELETE /tours', { params: req.params });
    const validationPipe = new ConvertToVoPipe('tour', false, 'id');
    const tourVo: TourVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TourVO,
    })) as TourVO;
    return await this.coreService.deleteTour(tourVo);
  }

  /**
   * PATCH /tours/assign-guide
   * Assign or update the guide for a tour.
   * ConvertToVoPipe builds a TourVO from the request.
   */
  @Patch('assign-guide')
  async assignGuideToTour(@Req() req: FastifyRequest): Promise<ResponseObject> {
    console.log('API Entry: PATCH /tours/assign-guide', { params: req.params });
    const validationPipe = new ConvertToVoPipe('package', true);
    const tourVo: TourVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TourVO,
    })) as TourVO;
    return this.coreService.assignGuideToTour(tourVo);
  }

  /**
   * PATCH /tours/availability
   * Update the availability (and possibly related fields) for a tour.
   */
  @Patch('availability')
  async updateTourAvailability(
    @Req() req: FastifyRequest,
  ): Promise<ResponseObject> {
    console.log('API Entry: PATCH /tours/availability', { params: req.params });
    const validationPipe = new ConvertToVoPipe('package', true);
    const tourVo: TourVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TourVO,
    })) as TourVO;
    return this.coreService.updateTourAvailability(tourVo);
  }

  /**
   * PATCH /tours/add-activity
   * Add or modify activities in a tour.
   * Body is validated using TourValidationPipe('update') and transformed to TourVO.
   */
  @Patch('add-activity')
  async addActivityToTour(
    @Body(new TourValidationPipe('update')) tourVo: TourVO,
  ): Promise<ResponseObject> {
    console.log('API Entry: PATCH /tours/add-activity', { body: tourVo });
    return await this.coreService.addActivityToTour(tourVo);
  }

  /**
   * PATCH /tours/remove-activity
   * Remove activities from a tour.
   * ConvertToVoPipe builds a TourVO with the id and activities to remove.
   */
  @Patch('remove-activity')
  async removeActivityFromTour(
    @Req() req: FastifyRequest,
  ): Promise<ResponseObject> {
    console.log('API Entry: PATCH /tours/remove-activity', {
      params: req.params,
    });
    const validationPipe = new ConvertToVoPipe('package', true);
    const tourVo: TourVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TourVO,
    })) as TourVO;
    return await this.coreService.removeActivityFromTour(tourVo);
  }

  /**
   * GET /tours/activities/:id
   * List activities associated with a specific tour.
   */
  @Get('activities/:id')
  async listActivitiesForTour(
    @Req() req: FastifyRequest,
  ): Promise<ResponseObject> {
    console.log('API Entry: GET /tours/activities/:id', { params: req.params });
    const validationPipe = new ConvertToVoPipe('package', false);
    const tourVo: TourVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TourVO,
    })) as TourVO;
    return await this.coreService.listActivitiesForTour(tourVo);
  }

  /**
   * GET /tours/current-activity-id
   * Placeholder endpoint for retrieving the current activity id in a tour session.
   * Currently not implemented.
   */
  @Get('current-activity-id')
  async getCurrentActivityId(): Promise<string> {
    console.log('API Entry: GET /tours/current-activity-id');
    return;
  }

  /**
   * PATCH /tours/set-current-activity/:id
   * Placeholder endpoint for setting the current activity id.
   * Currently not implemented.
   */
  @Patch('set-current-activity/:id')
  async setCurrentActivityId(@Param('id') id: string): Promise<string> {
    console.log('API Entry: PATCH /tours/set-current-activity/:id', { id });
    return;
  }

  /**
   * PATCH /tours/start-current-activity
   * Placeholder endpoint for starting the current activity.
   * Currently not implemented.
   */
  @Patch('start-current-activity')
  async startCurrentActivity(): Promise<boolean> {
    console.log('API Entry: PATCH /tours/start-current-activity');
    return;
  }

  /**
   * PATCH /tours/stop-current-activity
   * Placeholder endpoint for stopping the current activity.
   * Currently not implemented.
   */
  @Patch('stop-current-activity')
  async stopCurrentActivity(): Promise<boolean> {
    console.log('API Entry: PATCH /tours/stop-current-activity');
    return;
  }
}
