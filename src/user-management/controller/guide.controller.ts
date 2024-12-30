
import { Controller, Get, Post, Put, Delete, Param, Body, Inject, Req, BadRequestException } from '@nestjs/common';
import { IGuideService } from '../services/guide.service.interface';
import { GUIDE_SERVICE_TOKEN } from '../vo/token';
import { GuideVO } from '../vo/user.guide.vo';
import { ResponseObject } from 'src/shared/types';
import { GuideValidationPipe } from './guide.validation.pipe';
import { FastifyRequest } from 'fastify';

@Controller('guides')
export class GuideController {
constructor(@Inject(GUIDE_SERVICE_TOKEN) private readonly guideService: IGuideService){}

@Post()
async addTourist(
  @Req() req: FastifyRequest
): Promise<ResponseObject> {
  let guideVo: GuideVO;

  // Manually apply the validation pipe
  const validationPipe = new GuideValidationPipe();
  try {
    guideVo = await validationPipe.transform(req, { type: 'body', metatype: GuideVO });
  } catch (error) {
    throw new BadRequestException(error.message);
  }

  // Perform the logic to add a tourist
  return await this.guideService.addGuide(guideVo);
}

  @Delete(':uid')
  async deleteGuide(@Param('uid') uid: string): Promise<ResponseObject> {
    return await this.guideService.deleteGuide(uid);
  }

@Put(':uid')
  async updateTourist(
    @Param('uid') uid: string,
    @Req() req: FastifyRequest,
  ): Promise<ResponseObject> { 
    let guideVo: GuideVO;

    // Manually apply the validation pipe
    const validationPipe = new GuideValidationPipe('update');

    try {
      guideVo = await validationPipe.transform(req, { type: 'body', metatype: GuideVO });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    // return {} as ResponseObject;
    console.log(guideVo);
    
    return await this.guideService.updateGuide(uid, guideVo);
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
