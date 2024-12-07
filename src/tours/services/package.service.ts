import { Inject, Injectable } from '@nestjs/common';
import { PackageDAOInterface } from '../dao/package.dao.interface';
import { IPackageService } from './package.service.interface';
import { CORE_DAO_INTERFACE_TOKEN } from '../token';
import { PackageVO } from '../vo/package.master.vo';
import { plainToClass } from 'class-transformer';
import { Package } from '../dao/package.entity';
import { DataServiceResponse } from 'src/shared/types';

@Injectable()
export class PackageService implements IPackageService {
  constructor(
    @Inject(CORE_DAO_INTERFACE_TOKEN)
    private readonly PackageDAO: PackageDAOInterface,
  ) {}

  async findAllPackages(): Promise<DataServiceResponse> {
    return await this.PackageDAO.findAll();
  }

  findPackageById(id: string) {
    return this.PackageDAO.findById(id);
  }

  createPackage(packageVO: PackageVO) {
    return this.PackageDAO.create(packageVO.toEntity());
  }

  updatePackage(id: string, packageVO: PackageVO) {
    return this.PackageDAO.update(id, packageVO.toEntity());
  }

  deletePackage(id: string) {
    return this.PackageDAO.delete(id);
  }

  async readTours(tourId: string) {
    let tour: any = await this.PackageDAO.findById(tourId);
    return plainToClass(PackageVO, tour).tours;
  }

  async addTourToPackage(packageId: string, tourId: string) {
    const packages = await this.PackageDAO.findById(packageId);
    if (!packages) {
      throw new Error(`Package with ID ${packageId} not found.`);
    }
    packages.tour = tourId;
    await this.PackageDAO.update(packageId, packages);
  }

  async removeTourFromPackage(packageId: string, tourId: string) {
    let packageVo: PackageVO = new PackageVO();
    packageVo.id = tourId;
    return await this.PackageDAO.delete(packageId, packageVo.toEntity());
  }

  async assignGuideToPackage(packageId: string, guideId: string) {
    const packages = await this.PackageDAO.findById(packageId);
    if (!packages) {
      throw new Error(`Tour with ID ${packageId} not found.`);
    }
    packages.guide = guideId;
    await this.PackageDAO.update(packageId, packages);
  }

  async updatePackageAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<boolean> {
    return await this.PackageDAO.update(
      id,
      plainToClass(Package, { isAvailable: isAvailable }),
    );
  }
}
