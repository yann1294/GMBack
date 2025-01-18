import { Controller, Get, Post, Put, Delete, Param, Body, Inject, Req, BadRequestException } from '@nestjs/common';
import { TOURIST_SERVICE_TOKEN } from '../utils/token';
import { ITouristService } from '../services/tourist.service.interface';
import { ResponseObject } from 'src/shared/types';
import { TouristVO } from '../vo/tourist.vo';
import { TouristValidationPipe } from './tourist.validation.pipe';
import { ConvertToVoPipe } from 'src/shared/pipes/convert-to-vo.pipe';
import { FastifyRequest } from 'fastify';

@Controller('tourists')
export class TouristController {
  constructor(@Inject(TOURIST_SERVICE_TOKEN) private readonly touristService: ITouristService) {}

  @Post()
  async addTourist(
    @Req() req: FastifyRequest
  ): Promise<ResponseObject> {
    let touristVo: TouristVO;

    // Manually apply the validation pipe
    const validationPipe = new TouristValidationPipe();
    try {
      touristVo = await validationPipe.transform(req, { type: 'body', metatype: TouristVO });
    } catch (error) {
      throw new BadRequestException(error.response);
    }

    // Perform the logic to add a tourist
    return await this.touristService.addTourist(touristVo);
  }

  @Delete(':uid')
  async deleteTourist(@Req() req: FastifyRequest): Promise<ResponseObject> {

    const validationPipe = new ConvertToVoPipe("tourist", false, "uid");
    const touristVo: TouristVO = await validationPipe.transform(req, { type: 'param', metatype: TouristVO }) as TouristVO;
    return await this.touristService.deleteTourist(touristVo);
  }

  @Put(':uid')
  async updateTourist(
    @Req() req: FastifyRequest,
  ): Promise<ResponseObject> { 
    let touristVo: TouristVO;

    // Manually apply the validation pipe
    const validationPipe = new TouristValidationPipe('update');

    try {
      touristVo = await validationPipe.transform(req, { type: 'body', metatype: TouristVO });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
    
    return await this.touristService.updateTourist(touristVo);
  }

  @Get(':uid')
  async findTourist(@Req() req: FastifyRequest): Promise<ResponseObject> {

  const validationPipe = new ConvertToVoPipe("tourist", false, "uid");
  const touristVo: TouristVO = await validationPipe.transform(req, { type: 'param', metatype: TouristVO }) as TouristVO;
    return await this.touristService.findTourist(touristVo);
  }

  @Get()
  async getAllTourists(): Promise<ResponseObject> {
    return await this.touristService.getAllTourists();
  }
}
