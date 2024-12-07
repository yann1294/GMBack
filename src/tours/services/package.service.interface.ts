import { DataServiceResponse } from 'src/shared/types';
import { Package } from '../dao/package.entity';
import { PackageVO } from '../vo/package.master.vo';

export interface IPackageService {
  createPackage(packageVO: PackageVO): Promise<void>;
  //addUserToPackage(userId: string): Promise<void>;
  readTours(tourId: string): Promise<any>;
  assignGuideToPackage(tourId: string, guideId: string): Promise<void>;
  updatePackageAvailability(id: string, isAvailable: boolean): Promise<boolean>;
  updatePackage(id: string, packageVO: PackageVO): Promise<boolean>;
  findPackageById(id: string): Promise<Package>;
  findAllPackages(): Promise<DataServiceResponse>;
  addTourToPackage(packageId: string, tourId: string): Promise<void>;
  removeTourFromPackage(packageId: string, tourId: string): Promise<void>;
}
