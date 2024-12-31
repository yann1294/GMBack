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
import { deleteImage, uploadImages } from '../utils/upload-images.util';
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
    return this.packageDAO.update(packageVo.toEntity());
  }

  deletePackage(packageVo: PackageVO) {
    return this.packageDAO.delete(packageVo.toEntity());
  }

  async readTours(packageVo: PackageVO): Promise<ResponseObject> {    
    let response: ResponseObject = await this.packageDAO.findById(packageVo.toEntity());
    
    if  (response.status !== 'success') {
      return response;
    }
    return {...response, data: response.data['tours']} as ResponseObject;
  }

  async addTourToPackage(packageVo: PackageVO): Promise<ResponseObject> {
    // const packages = await this.packageDAO.findById(packageId);
    // if (!packages) {
    //   throw new Error(`Package with ID ${packageId} not found.`);
    // }
    // packages.tour = tourId;
    return await this.packageDAO.update(
      plainToInstance(Package, {
        tours: FieldValue.arrayUnion(...packageVo.tours) 
      })
    );
  }
  
  async removeTourFromPackage(packageVo: PackageVO): Promise<ResponseObject> {
    // let packageVo: PackageVO = new PackageVO();
    // packageVo.id = tourId;
    return await this.packageDAO.update(
      plainToInstance(Package, {
        tours: FieldValue.arrayRemove(...packageVo.tours) 
      })
    );
  }

  async assignGuideToPackage(packageVo: PackageVO): Promise<ResponseObject> {
    return await this.packageDAO.update(packageVo.toEntity());
  }

  async updatePackageAvailability(packageVo: PackageVO): Promise<ResponseObject> {
    return await this.packageDAO.update(packageVo.toEntity());
  }
}
