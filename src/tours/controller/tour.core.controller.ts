import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { CoreService } from '../services/tour.core.service';
import { CreateTourDTO } from './dto/tour.create.dto';
//import { UpdateTourDTO } from './dto/tour.update.dto';

@Controller('tours/core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get()
  findAll() {
    return this.coreService.findAllTours();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coreService.findTourById(id);
  }

  @Post()
  create(@Body() createTourDTO: CreateTourDTO) {
    return this.coreService.createTour(createTourDTO);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateTourDTO: UpdateTourDTO) {
  //   return this.coreService.updateTour(id, updateTourDTO);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coreService.deleteTour(id);
  }
}
