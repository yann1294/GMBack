// import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FileService } from 'src/shared/services/file.service';
import { DataServiceResponse } from 'src/types';
import { Tour } from './entities/tour.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { TourValidationPipe } from './validation.pipe';

@Controller('tours')
export class TourController {
  // inject firebase repository
  constructor(
    private readonly dataService: DataService,
    private readonly fileService: FileService,
  ) {}

  @Post('create')
  async createTour(
    @Body(new TourValidationPipe()) tour: Tour,
  ): Promise<DataServiceResponse> {
    return await this.dataService.createDoc(tour.toObject(), 'tours');
  }
}
