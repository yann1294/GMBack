import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { CoreService } from './core.service';
import { CreateTourDTO, UpdateTourDTO } from './dtos/tour.dto';

@Controller('tours')
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

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTourDTO: UpdateTourDTO) {
    return this.coreService.updateTour(id, updateTourDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coreService.deleteTour(id);
  }
}
