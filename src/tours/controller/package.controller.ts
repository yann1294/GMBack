import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  Patch,
} from '@nestjs/common';
import { PackageService } from '../services/package.service';
import { CORE_SERVICE_TOKEN, PACKAGE_SERVICE_TOKEN } from '../token';
import { Package } from '../dao/package.entity';
import { fromEventPattern } from 'rxjs';
import { ResponseObject } from 'src/shared/types';
import { PackageValidationPipe } from './package.validation.pipe';
import { PackageVO } from '../vo/package.master.vo';
import { IPackageService } from '../services/package.service.interface';
import { HasAttribute } from 'src/shared/pipes/has-attribute.pipe';

@Controller('packages')
export class PackageController {
  constructor(
    @Inject(PACKAGE_SERVICE_TOKEN) private readonly packageService: IPackageService,
  ) { }

  @Get()
  async findAll(): Promise<ResponseObject> {
    return await this.packageService.findAllPackages();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.packageService.findPackageById(id);
  }

  @Post()
  async create(@Body(new PackageValidationPipe()) packageVo: PackageVO) {
    return this.packageService.createPackage(packageVo);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new PackageValidationPipe('update')) packageVo: PackageVO,
  ) {
    return this.packageService.updatePackage(id, packageVo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.deletePackage(id);
  }

  @Get(':id/tours')
  async getToursFromPackage(@Param('id') packageId: string) {    
    return await this.packageService.readTours(packageId);
  }

  @Patch(':id/tours')
  addTourToPackage(@Param('id') packageId: string, @Body(new HasAttribute(['tourId'])) body: { tourId: string | string[] }) {
    return this.packageService.addTourToPackage(packageId, body.tourId);
  }

  @Delete(':id/tours')
  removeTourFromPackage(
    @Param('id') packageId: string, @Body(new HasAttribute(['tourId'])) body: { tourId: string | string[] }
  ) {
    return this.packageService.removeTourFromPackage(packageId, body.tourId);
  }

  @Patch('assign-guide')
  async assignGuideToTour(
    @Body(new HasAttribute(['packageId', 'guideId'])) body: { packageId: string, guideId: string },
  ): Promise<ResponseObject> {
    return await this.packageService.assignGuideToPackage(body.packageId, body.guideId);
  }

  @Patch('availability')
  async updateTourAvailability(
    @Body(new HasAttribute(['isAvailable', 'packageId'])) body: {packageId: string, isAvailable: boolean},
  ): Promise<ResponseObject> {
       return await this.packageService.updatePackageAvailability(body.packageId, body.isAvailable);
  }

}
