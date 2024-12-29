import { Controller, Get, Post, Put, Delete, Param, Body, Inject, Req, UsePipes, BadRequestException } from '@nestjs/common';
import { TOURIST_SERVICE_TOKEN } from '../vo/token';
import { ITouristService } from '../services/tourist.service.interface';
import { ResponseObject } from 'src/shared/types';
import { TouristVO } from '../vo/user.tourist.vo';
// import { TouristValidationPipe } from './tourist.validation.pipe';
import { log } from 'console';
import { FastifyRequest } from 'fastify';
import { TouristValidationPipe } from './tourist.validation.pipe';

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
      throw new BadRequestException(error.message);
    }

    // Perform the logic to add a tourist
    return await this.touristService.addTourist(touristVo);
  }

  @Delete(':uid')
  async deleteTourist(@Param('uid') uid: string): Promise<ResponseObject> {
    return await this.touristService.deleteTourist(uid);
  }

//   @Put(':uid')
//   async updateTourist(
//     @Param('uid') uid: string,
//     @Body(new TouristValidationPipe('update')) data: TouristVO,
//   ): Promise<ResponseObject> {    
//     return await this.touristService.updateTourist(uid, data);
//   }

//   @Get(':uid')
//   async findTourist(@Param('uid') uid: string): Promise<ResponseObject> {
//     return await this.touristService.findTourist(uid);
//   }

//   @Get()
//   async getAllTourists(): Promise<ResponseObject> {
//     return await this.touristService.getAllTourists();
//   }
}
