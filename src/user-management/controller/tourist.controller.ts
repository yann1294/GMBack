import { Controller, Get, Post, Put, Delete, Param, Body, Inject } from '@nestjs/common';
import { TOURIST_SERVICE_TOKEN } from '../utils/token';
import { ITouristService } from '../services/tourist.service.interface';
import { ResponseObject } from 'src/shared/types';
import { TouristVO } from '../vo/user.tourist.vo';
import { TouristValidationPipe } from './tourist.validation.pipe';
import { log } from 'console';

@Controller('tourists')
export class TouristController {
  constructor(@Inject(TOURIST_SERVICE_TOKEN) private readonly touristService: ITouristService) {}

  @Post()
  async addTourist(@Body(new TouristValidationPipe()) touristVo: TouristVO): Promise<ResponseObject> {
    return await this.touristService.addTourist(touristVo);
  }

  @Delete(':uid')
  async deleteTourist(@Param('uid') uid: string): Promise<ResponseObject> {
    return await this.touristService.deleteTourist(uid);
  }

  @Put(':uid')
  async updateTourist(
    @Param('uid') uid: string,
    @Body(new TouristValidationPipe('update')) data: TouristVO,
  ): Promise<ResponseObject> {    
    return await this.touristService.updateTourist(uid, data);
  }

  @Get(':uid')
  async findTourist(@Param('uid') uid: string): Promise<ResponseObject> {
    return await this.touristService.findTourist(uid);
  }

  @Get()
  async getAllTourists(): Promise<ResponseObject> {
    return await this.touristService.getAllTourists();
  }
}
