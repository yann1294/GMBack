import { ResponseObject } from 'src/shared/types';
import { Package } from '../dao/package.entity';
import { PackageVO } from '../vo/package.master.vo';
import { MultipartFile } from '@fastify/multipart';

export interface IPackageService {
  createPackage(packageVO: PackageVO): Promise<ResponseObject>;
  readTours(packageId: string): Promise<ResponseObject>;
  deletePackage(packageId: string): Promise<ResponseObject>;
  assignGuideToPackage(packageId: string, guideId: string): Promise<ResponseObject>;
  updatePackageAvailability(id: string, isAvailable: boolean): Promise<ResponseObject>;
  updatePackage(id: string, packageVO: PackageVO): Promise<ResponseObject>;
  findPackageById(id: string): Promise<ResponseObject>;
  findAllPackages(): Promise<ResponseObject>;
  addTourToPackage(packageId: string, tourId: string | string[]): Promise<ResponseObject>;
  removeTourFromPackage(packageId: string, tourId: string | string[]): Promise<ResponseObject>;
  uploadImages(tourId: string, images: AsyncIterableIterator<MultipartFile>): Promise<ResponseObject>;
  deleteImage(tourId: string, image: string): Promise<ResponseObject>;
}
