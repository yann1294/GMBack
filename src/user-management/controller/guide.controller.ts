
import { Controller, Get, Post, Put, Delete, Param, Body, Inject } from '@nestjs/common';
import { IGuideService } from '../services/guide.service.interface';
import { GUIDE_SERVICE_TOKEN } from '../utils/token';
import { GuideVO } from '../vo/guide.vo';
import { ResponseObject } from 'src/shared/types';
import { GuideValidationPipe } from './guide.validation.pipe';

@Controller('guides')
export class GuideController {
constructor(@Inject(GUIDE_SERVICE_TOKEN) private readonly guideService: IGuideService){}


  @Post()
  async addGuide(@Body(new GuideValidationPipe()) guideVo: GuideVO): Promise<ResponseObject> {
    return await this.guideService.addGuide(guideVo);
  }

  @Delete(':uid')
  async deleteGuide(@Param('uid') uid: string): Promise<ResponseObject> {
    return await this.guideService.deleteGuide(uid);
  }

  @Put(':uid')
  async updateGuide(
    @Param('uid') uid: string,
    @Body(new GuideValidationPipe('update')) data: GuideVO,
  ): Promise<ResponseObject> {
    return await this.guideService.updateGuide(uid, data);
  }

  @Get(':uid')
  async findGuide(@Param('uid') uid: string): Promise<ResponseObject> {
    return await this.guideService.findGuide(uid);
  }

  @Get()
  async getAllGuides(): Promise<ResponseObject> {
    return await this.guideService.getAllGuides();
  }
}
