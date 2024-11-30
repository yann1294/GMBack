import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TourPackageService } from '../services/tour-package.service';
import { CreatePackageDTO, UpdatePackageDTO } from './dto/package.dto';


@Controller('tour-packages')
export class TourPackageController {
  constructor(private readonly tourPackageService: TourPackageService) {}

  @Get()
  findAll() {
    return this.tourPackageService.findAllPackages();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourPackageService.findPackageById(id);
  }

  @Post()
  create(@Body() createPackageDTO: CreatePackageDTO) {
    return this.tourPackageService.createPackage(createPackageDTO);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePackageDTO: UpdatePackageDTO) {
    return this.tourPackageService.updatePackage(id, updatePackageDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourPackageService.deletePackage(id);
  }

  @Put(':id/tours')
  addTourToPackage(@Param('id') packageId: string, @Body() tourId: string) {
    return this.tourPackageService.addTourToPackage(packageId, tourId);
  }

  @Delete(':id/tours/:tourId')
  removeTourFromPackage(@Param('id') packageId: string, @Param('tourId') tourId: string) {
    return this.tourPackageService.removeTourFromPackage(packageId, tourId);
  }
}
