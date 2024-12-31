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
 async uploadImages(tourId: string, images: AsyncIterableIterator<MultipartFile>): Promise<ResponseObject> {
    // return await uploadImages(tourId, images, 'packages');
    return {status: 'success', message: 'Images uploaded successfully'} as ResponseObject;

  }
  async deleteImage(tourId: string, image: string): Promise<ResponseObject> {
    // return await deleteImage(tourId, image, 'packages');
    return {status: 'success', message: 'Images uploaded successfully'} as ResponseObject;

  }

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

  async readTours(packageId: string): Promise<ResponseObject> {    
    let response: ResponseObject = await this.packageDAO.findById(packageId);
    
    if  (response.status !== 'success') {
      return response;
    }
    return {...response, data: response.data['tours']} as ResponseObject;
  }

  async addTourToPackage(packageId: string, tourId: string | string[]) {
    // const packages = await this.packageDAO.findById(packageId);
    // if (!packages) {
    //   throw new Error(`Package with ID ${packageId} not found.`);
    // }
    // packages.tour = tourId;
    const tours: string[] = Array.isArray(tourId) ? tourId : [tourId];
    return await this.packageDAO.update(
      packageId, 
      plainToInstance(Package, {
        tours: FieldValue.arrayUnion(...tours) 
      })
    );
  }
  
  async removeTourFromPackage(packageId: string, tourId: string | string[]) {
    // let packageVo: PackageVO = new PackageVO();
    // packageVo.id = tourId;
    const tours: string[] = Array.isArray(tourId) ? tourId : [tourId];
    return await this.packageDAO.update(
      packageId, 
      plainToInstance(Package, {
        tours: FieldValue.arrayRemove(...tours) 
      })
    );
  }

  async assignGuideToPackage(packageId: string, guideId: string): Promise<ResponseObject> {
    return await this.packageDAO.update(packageId, plainToClass(Package, {guide: guideId}));
  }

  async updatePackageAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<ResponseObject> {
    return await this.packageDAO.update(
      id,
      plainToClass(Package, { isAvailable: isAvailable }),
    );
  }
}
