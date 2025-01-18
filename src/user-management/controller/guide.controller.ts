
import { Controller, Get, Post, Put, Delete, Param, Body, Inject } from '@nestjs/common';
import { IGuideService } from '../services/guide.service.interface';
import { GUIDE_SERVICE_TOKEN } from '../utils/token';
import { GuideVO } from '../vo/guide.vo';
import { ResponseObject } from 'src/shared/types';
import { GuideValidationPipe } from './guide.validation.pipe';
import { FastifyRequest } from 'fastify';
import { ConvertToVoPipe } from 'src/shared/pipes/convert-to-vo.pipe';

@Controller('guides')
export class GuideController {
  constructor(@Inject(GUIDE_SERVICE_TOKEN) private readonly guideService: IGuideService) { }

  @Post()
  async addGuide(
    @Req() req: FastifyRequest
  ): Promise<ResponseObject> {
    let guideVo: GuideVO;

    // Manually apply the validation pipe
    const validationPipe = new GuideValidationPipe();
    try {
      guideVo = await validationPipe.transform(req, { type: 'body', metatype: GuideVO });
    } catch (error) {
    console.log(error.response);

      throw new BadRequestException(error.response);
    }
    // Perform the logic to add a tourist
    return await this.guideService.addGuide(guideVo);
  }

  @Delete(':uid')
  async deleteGuide(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe("guide", false, "uid");
    const guideVo: GuideVO = await validationPipe.transform(req, { type: 'param', metatype: GuideVO }) as GuideVO;
    return await this.guideService.deleteGuide(guideVo);
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
      throw new BadRequestException(error.response);
    }

    return await this.guideService.updateGuide(guideVo);
  }

  @Get(':uid')
  async findGuide(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe("guide", false, "uid");
    const guideVo: GuideVO = await validationPipe.transform(req, { type: 'param', metatype: GuideVO }) as GuideVO;
    return await this.guideService.findGuide(guideVo);
  }

  @Get()
  async getAllGuides(): Promise<ResponseObject> {
    return await this.guideService.getAllGuides();
  }
}
