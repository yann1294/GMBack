// import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FileService } from 'src/shared/services/file.service';
import { ResponseObject } from 'src/shared/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TourValidationPipe } from './validation.pipe';
import { log } from 'console';
import { TourVO } from '../vo/tour.master.vo';
import { ITourService } from '../services/tour.service.interface';
import { Tour } from '../dao/tour.entity';

@Controller('tours')
export class TourController {
  collectionName: string = 'tours';

  // inject firebase repository
  constructor(
    private readonly dataService: DataService,
    private readonly fileService: FileService,
    private readonly tourService: ITourService,
  ) {}

  @Post()
  async createTour(
    @Body(new TourValidationPipe()) tourVo: TourVO,
  ): Promise<ResponseObject> {
    // transform data to entity
    const tour: Tour = tourVo.toEntity();

    // process data with service
    // return await this.dataService.createDoc(
    //   tour,
    //   this.collectionName,
    // );
    return;
  }

  @Patch()
  update() {
    this.tourService.updateTour('name', 'id');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    log(id);
    return await this.dataService.readDoc(this.collectionName, id);
  }

  @Get()
  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<ResponseObject> {
    log(id);
    return await this.dataService.deleteDoc(this.collectionName, id);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() data: object,
  ): Promise<ResponseObject> {
    return this.dataService.updateDoc(this.collectionName, id, data);
  }
}
