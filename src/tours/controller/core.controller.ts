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
    private readonly imageManager: ImageManager
  ) { }
  @Post('images')
  async uploadImage(@Req() req: FastifyRequest): Promise<ResponseObject> {
    console.log("API Entry: POST /tours/images", { body: req.body });

    // Checking whether request is multipart
    if (!req.isMultipart()) {
      throw new BadRequestException('Request must be multipart');
    }

    let id: string = null;
    const uploadedFiles: FileDTO[] = [];

    let hasFiles = false;

    // checking whether file exceeds the limit
    try {

      // Iterate over multipart parts
      for await (const part of req.parts({ limits: { fileSize: 2 * 1024 * 1024 } })) {
        if (part.type === 'file') {
          console.log("File", part.type, part.filename);

          hasFiles = true;
          let fileBuffer: Buffer = await part.toBuffer();

          uploadedFiles.push(new FileDTO(
            part.fieldname,
            part.encoding,
            part.mimetype,
            part.filename,
            fileBuffer.byteLength,
            fileBuffer,
          ));
        } else if (part.type === 'field' && part.fieldname === 'id') {
          id = part.value as string;
        }
      }
    } catch (error) {
      if (error.message === "request file too large"){
      return {
        status: "failure",
        data: null,
        message: `Each file must have a file size of 1MB or less`,
        code: 400,
      };} 

      console.log("Error", error);
    }

    console.log("ID", id);
    console.log("Uploaded Files", uploadedFiles);

    if (!hasFiles) {
      return {
        status: "failure",
        data: null,
        message: "No files found in form body",
        code: 400,
      };
    }

    if (!id) {
      return {
        status: "failure",
        data: null,
        message: "Id must be included in form body",
        code: 400,
      };
    }

    // Uploading images
    return await this.imageManager.uploadImages(id, uploadedFiles, "tours");
  }



  @Post()
  async createTour(
    @Body(new TourValidationPipe()) tourVo: TourVO,
  ): Promise<ResponseObject> {
    console.log("API Entry: POST /tours", { body: tourVo });
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

  @Patch(":id")
  async update(@Req() req: FastifyRequest): Promise<ResponseObject> {
    console.log("API Entry: PATCH /tours", { params: req.params });
    const validationPipe = new ConvertToVoPipe("tour", true, "id", "update");
    const tourVo: TourVO = await validationPipe.transform(req, { type: 'param', metatype: TourVO }) as TourVO;
    return await this.coreService.updateTour(tourVo);
  }

  @Get()
  async findAllTours(): Promise<ResponseObject> {
    console.log('API Entry: GET /tours');
    return await this.coreService.findAllTours();
  }

  @Delete(':id')
  async Delete(@Req() req: FastifyRequest): Promise<ResponseObject> {
    console.log("API Entry: DELETE /tours", { params: req.params });
    const validationPipe = new ConvertToVoPipe("tour", false, "id");
    const tourVo: TourVO = await validationPipe.transform(req, { type: 'param', metatype: TourVO }) as TourVO;
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
