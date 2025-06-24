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
  collectionName: string = 'tours';

  constructor(
    @Inject(CORE_SERVICE_TOKEN) private readonly coreService: ICoreService,
    private readonly imageManager: ImageManager,
  ) {}
  @Post('images')
  async uploadImage(@Req() req: FastifyRequest): Promise<ResponseObject> {
    // Uploading images
    return await this.imageManager.uploadImages(req, 'tours');
  }

  @Post()
  async createTour(
    @Body(new TourValidationPipe()) tourVo: TourVO,
  ): Promise<ResponseObject> {
    console.log('API Entry: POST /tours', { body: tourVo });
    return await this.coreService.createTour(tourVo);
  }

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

  @Patch(':id')
  async update(@Req() req: FastifyRequest): Promise<ResponseObject> {
    console.log('API Entry: PATCH /tours', { params: req.params });
    const validationPipe = new ConvertToVoPipe('tour', true, 'id', 'update');
    const tourVo: TourVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: TourVO,
    })) as TourVO;
    // Convert VO→Entity, then log the final plain object:
    const entity = tourVo.toEntity();
    console.log('SERVICE → tourEntity.activities', entity.activities);
    console.log('🔍 will write to Firestore:', entity.toUpdateObject());
    return await this.coreService.updateTour(entity);
  }

  @Get()
  async findAllTours(): Promise<ResponseObject> {
    console.log('API Entry: GET /tours');
    return await this.coreService.findAllTours();
  }

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

  @Patch('add-activity')
  async addActivityToTour(
    @Body(new TourValidationPipe('update')) tourVo: TourVO,
  ): Promise<ResponseObject> {
    console.log('API Entry: PATCH /tours/add-activity', { body: tourVo });
    return await this.coreService.addActivityToTour(tourVo);
  }

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

  @Get('current-activity-id')
  async getCurrentActivityId(): Promise<string> {
    console.log('API Entry: GET /tours/current-activity-id');
    return;
  }

  @Patch('set-current-activity/:id')
  async setCurrentActivityId(@Param('id') id: string): Promise<string> {
    console.log('API Entry: PATCH /tours/set-current-activity/:id', { id });
    return;
  }

  @Patch('start-current-activity')
  async startCurrentActivity(): Promise<boolean> {
    console.log('API Entry: PATCH /tours/start-current-activity');
    return;
  }

  @Patch('stop-current-activity')
  async stopCurrentActivity(): Promise<boolean> {
    console.log('API Entry: PATCH /tours/stop-current-activity');
    return;
  }
}
