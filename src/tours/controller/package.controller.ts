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
import { CORE_SERVICE_TOKEN } from '../token';
import { Package } from '../dao/package.entity';
import { fromEventPattern } from 'rxjs';
import { DataServiceResponse } from 'src/shared/types';
import { PackageValidationPipe } from './package.validation.pipe';
import { PackageVO } from '../vo/package.master.vo';

@Controller('packages')
export class PackageController {
  collectionName: string = 'tours';
  constructor(
    @Inject(CORE_SERVICE_TOKEN) private readonly packageService: PackageService,
  ) {}

  @Get()
  async findAll(): Promise<DataServiceResponse> {
    return await this.packageService.findAllPackages();
  }

  @Get('find-by-id')
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

  @Patch(':id/tours/:tourId')
  addTourToPackage(@Param('id') packageId: string, @Body() tourId: string) {
    return this.packageService.addTourToPackage(packageId, tourId);
  }

  @Delete(':id/tours/:tourId')
  removeTourFromPackage(
    @Param('id') packageId: string,
    @Param('tourId') tourId: string,
  ) {
    return this.packageService.removeTourFromPackage(packageId, tourId);
  }
}
