import { Inject, Injectable } from '@nestjs/common';
import { PackageDAOInterface } from '../dao/package.dao.interface';
import { IPackageService } from './package.service.interface';
import { PACKAGE_DAO_INTERFACE_TOKEN } from '../token';
import { PackageVO } from '../vo/package.master.vo';
import { plainToClass } from 'class-transformer';
import { Package } from '../dao/package.entity';
import { ResponseObject } from 'src/shared/types';

@Injectable()
export class PackageService implements IPackageService {
  constructor(
    @Inject(PACKAGE_DAO_INTERFACE_TOKEN)
    private readonly packageDAO: PackageDAOInterface,
  ) {}

  async findAllPackages(): Promise<ResponseObject> {
    return await this.packageDAO.findAll();
  }

  findPackageById(id: string) {
    return this.packageDAO.findById(id);
  }

  createPackage(packageVO: PackageVO) {
    return this.packageDAO.create(packageVO.toEntity());
  }

  updatePackage(id: string, packageVO: PackageVO) {
    return this.packageDAO.update(id, packageVO.toEntity());
  }

  deletePackage(id: string) {
    return this.packageDAO.delete(id);
  }

  async readTours(tourId: string) {
    let tour: any = await this.packageDAO.findById(tourId);
    return plainToClass(PackageVO, tour).tours;
  }

  async addTourToPackage(packageId: string, tourId: string) {
    const packages = await this.packageDAO.findById(packageId);
    if (!packages) {
      throw new Error(`Package with ID ${packageId} not found.`);
    }
    packages.tour = tourId;
    await this.packageDAO.update(packageId, packages);
  }

  async removeTourFromPackage(packageId: string, tourId: string) {
    let packageVo: PackageVO = new PackageVO();
    packageVo.id = tourId;
    return await this.packageDAO.delete(packageId, packageVo.toEntity());
  }

  async assignGuideToPackage(packageId: string, guideId: string) {
    const packages = await this.packageDAO.findById(packageId);
    if (!packages) {
      throw new Error(`Tour with ID ${packageId} not found.`);
    }
    packages.guide = guideId;
    await this.packageDAO.update(packageId, packages);
  }

  async updatePackageAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<boolean> {
    return await this.packageDAO.update(
      id,
      plainToClass(Package, { isAvailable: isAvailable }),
    );
  }
}
