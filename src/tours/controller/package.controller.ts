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
import { CONTEXT } from 'src/shared/utils/context';

/**
 * PackageController
 * - HTTP interface for managing tour packages.
 * - Delegates business logic to IPackageService.
 * - Uses ConvertToVoPipe and validation pipes to map HTTP inputs to VO.
 */
@Controller('packages')
export class PackageController {
  constructor(
    @Inject(PACKAGE_SERVICE_TOKEN)
    private readonly packageService: IPackageService,
    private readonly imageManager: ImageManager,
  ) {}
  /**
   * POST /packages/images
   * - Upload images for a package (multipart).
   * - Delegates file handling and persistence to ImageManager.
   */
  @Post('images')
  async uploadImage(@Req() req: FastifyRequest): Promise<ResponseObject> {
    // Uploading images
    return await this.imageManager.uploadImages(req, 'packages');
  }

  /**
   * GET /packages
   * - Return all packages.
   */
  @Get()
  async findAll(): Promise<ResponseObject> {
    return await this.packageService.findAllPackages();
  }

  /**
   * GET /packages/:id
   * - Fetch a single package by id.
   * - ConvertToVoPipe builds a PackageVO from request params.
   */
  @Get(':id')
  async findOne(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe('package', false, 'id');
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.findPackageById(packageVo);
  }

  /**
   * POST /packages
   * - Create a new package.
   * - Body is validated by PackageValidationPipe, then mapped to PackageVO.
   */
  @Post()
  async create(@Body(new PackageValidationPipe()) packageVo: PackageVO) {
    return this.packageService.createPackage(packageVo);
  }

  // @Patch(':id')
  // update(@Body(new PackageValidationPipe('update')) packageVo: PackageVO) {
  //   return this.packageService.updatePackage(packageVo);
  // }

  /**
   * PATCH /packages/:id
   * - Partial update of a package.
   * - ConvertToVoPipe('updateDetails') prepares a VO with only fields to patch.
   */
  @Patch(':id')
  async update(@Req() req: FastifyRequest) {
    const pipe = new ConvertToVoPipe('package', true, 'id', 'updateDetails');
    const vo = (await pipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.updatePackage(vo);
  }

  /**
   * DELETE /packages/:id
   * - Delete a package by id.
   */
  @Delete(':id')
  async remove(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe('package', false, 'id');
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.deletePackage(packageVo);
  }

  /**
   * GET /packages/:id/tours
   * - Retrieve all tours associated with a package.
   */
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

  /**
   * PATCH /packages/:id/tours
   * - Replace / set tours array for a package.
   * - ConvertToVoPipe('updateTours') expects tours in the request body.
   */
  @Patch(':id/tours')
  async addTourToPackage(@Req() req: FastifyRequest): Promise<ResponseObject> {
    const validationPipe = new ConvertToVoPipe(
      'package',
      true,
      'id',
      'updateTours',
    );
    const packageVo: PackageVO = (await validationPipe.transform(req, {
      type: 'param',
      metatype: PackageVO,
    })) as PackageVO;
    return this.packageService.addTourToPackage(packageVo);
  }

  /**
   * DELETE /packages/tours
   * - Remove one or more tours from a package.
   * - Package id and tour ids are extracted via ConvertToVoPipe.
   */
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

  /**
   * PATCH /packages/assign-guide
   * - Assign a guide to a package.
   * - VO is built from request via ConvertToVoPipe.
   */
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

  /**
   * PATCH /packages/availability
   * - Update availability flag (and possibly other fields) for a package.
   */
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

  // Legacy image upload/delete endpoints kept as reference
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
