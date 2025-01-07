import { ResponseObject } from 'src/shared/types';
import { Package } from '../dao/package.entity';
import { PackageVO } from '../vo/package.master.vo';
import { MultipartFile } from '@fastify/multipart';

export interface IPackageService {
  createPackage(packageVO: PackageVO): Promise<ResponseObject>;
  readTours(packageVO: PackageVO): Promise<ResponseObject>;
  deletePackage(packageVO: PackageVO): Promise<ResponseObject>;
  assignGuideToPackage(packageVO: PackageVO): Promise<ResponseObject>;
  updatePackageAvailability(packageVO: PackageVO): Promise<ResponseObject>;
  updatePackage(packageVO: PackageVO): Promise<ResponseObject>;
  findPackageById(packageVO: PackageVO): Promise<ResponseObject>;
  findAllPackages(): Promise<ResponseObject>;
  addTourToPackage(packageVO: PackageVO): Promise<ResponseObject>;
  removeTourFromPackage(packageVo: PackageVO): Promise<ResponseObject>;
}
