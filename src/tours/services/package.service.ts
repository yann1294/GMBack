import { Inject, Injectable } from '@nestjs/common';
import { PackageDAOInterface } from '../dao/package.dao.interface';
import { IPackageService } from './package.service.interface';
import { PACKAGE_DAO_INTERFACE_TOKEN } from '../token';
import { PackageVO } from '../vo/package.master.vo';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Package } from '../dao/package.entity';
import { ResponseObject } from 'src/shared/types';
import { FieldValue } from 'firebase-admin/firestore';
import { MultipartFile } from '@fastify/multipart';
// import { deleteImage, uploadImages } from '../utils/upload-images.util';

@Injectable()
export class PackageService implements IPackageService {
  constructor(
    @Inject(PACKAGE_DAO_INTERFACE_TOKEN)
    private readonly packageDAO: PackageDAOInterface,
  ) {}
  async findAllPackages(): Promise<ResponseObject> {
    return await this.packageDAO.findAll();
  }

  findPackageById(packageVo: PackageVO) {
    return this.packageDAO.findById(packageVo.toEntity());
  }

  createPackage(packageVo: PackageVO) {
    return this.packageDAO.create(packageVo.toEntity());
  }

  updatePackage(packageVo: PackageVO) {
    const patch: any = {
      name: packageVo.name,
      price: packageVo.price,
      images: packageVo.images,
      durationDays: packageVo.durationDays,
      discount: packageVo.discount,
      numberOfSeats: packageVo.numberOfSeats,
      description: packageVo.description,
      isAvailable: packageVo.isAvailable,
      date: packageVo.date,
      guide: packageVo.guide,
      location: packageVo.location,
      // ❌ no "tours" here
    };
    return this.packageDAO.updatePartial(packageVo.id, patch);
  }

  deletePackage(packageVo: PackageVO) {
    return this.packageDAO.delete(packageVo.toEntity());
  }

  async readTours(packageVo: PackageVO): Promise<ResponseObject> {
    return await this.packageDAO.readTours(packageVo.toEntity());
  }

  async addTourToPackage(packageVo: PackageVO): Promise<ResponseObject> {
    const { id, tours } = packageVo;

    if (!Array.isArray(tours) || !tours.every((t) => typeof t === 'string')) {
      return {
        status: 'failure',
        code: 400,
        message: 'tours must be an array of strings',
        data: null,
      };
    }
    return await this.packageDAO.updatePartial(id, { tours });
  }

  async removeTourFromPackage(packageVo: PackageVO): Promise<ResponseObject> {
    // let packageVo: PackageVO = new PackageVO();
    // packageVo.id = tourId;
    return await this.packageDAO.update(
      plainToInstance(Package, {
        tours: FieldValue.arrayRemove(...packageVo.tours),
      }),
    );
  }

  async assignGuideToPackage(packageVo: PackageVO): Promise<ResponseObject> {
    return await this.packageDAO.update(packageVo.toEntity());
  }

  async updatePackageAvailability(
    packageVo: PackageVO,
  ): Promise<ResponseObject> {
    return await this.packageDAO.update(packageVo.toEntity());
  }
}
