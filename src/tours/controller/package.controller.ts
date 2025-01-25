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
  Req,
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
import { ConvertToVoPipe } from 'src/shared/pipes/convert-to-vo.pipe';
import { FastifyRequest } from 'fastify';
import { ImageManager } from '../utils/upload-images.util';

@Controller('packages')
export class PackageController {
  constructor(
    @Inject(PACKAGE_SERVICE_TOKEN)
    private readonly packageService: IPackageService,
  private readonly imageManager: ImageManager
   ) { }
   @Post('images')
   async uploadImage(@Req() req: FastifyRequest): Promise<ResponseObject> {
     
     // Uploading images
     return await this.imageManager.uploadImages(req, "packages");
   }
 
  @Get()
  async findAll(): Promise<ResponseObject> {
    return await this.packageService.findAllPackages();
  }

  @Get(':id')
  async findOne(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe('package', false, 'id');
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.findPackageById(packageVo);
  }

  @Post()
  async create(@Body(new PackageValidationPipe()) packageVo: PackageVO) {
    return this.packageService.createPackage(packageVo);
  }

  @Patch(':id')
  update(@Body(new PackageValidationPipe('update')) packageVo: PackageVO) {
    return this.packageService.updatePackage(packageVo);
  }

  @Delete(':id')
  async remove(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe('package', false, 'id');
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.deletePackage(packageVo);
  }

  @Get(':id/tours')
  async getToursFromPackage(
    @Req() req: FastifyRequest,
  ): Promise<ResponseObject> {
    console.log('Request', req.url);
    const validationPipe = new ConvertToVoPipe('package', false, 'id');
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.readTours(packageVo);
  }

  @Patch('tours')
  async addTourToPackage(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe('package', true);
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.addTourToPackage(packageVo);
  }

  @Delete('tours')
  async removeTourFromPackage(
    @Req() req: FastifyRequest,
  ): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe('package', true);
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.removeTourFromPackage(packageVo);
  }

  @Patch('assign-guide')
  async assignGuideToPackage(
    @Req() req: FastifyRequest,
  ): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe('package', true);
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.assignGuideToPackage(packageVo);
  }

  @Patch('availability')
  async updatePackageAvailability(
    @Req() req: FastifyRequest,
  ): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe('package', true);
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.updatePackageAvailability(packageVo);
  }

  // // upload an image for a tour
  //   @Post('upload-image/:packageId/')
  //   async uploadImage(@Req() req: FastifyRequest): Promise<ResponseObject> {
  //     return await uploadImages(req.params['packageId'], req.files(), 'packages');
  //   }

  //   // Delete an image for a tour
  //   @Delete('delete-image')
  //   async deleteImage(@Body(new HasAttribute(['packageId', 'image'])) body: { packageId: string, image: string}): Promise<ResponseObject> {
  //     return await deleteImage(body.packageId, body.image, 'packages');
  //   }
}
