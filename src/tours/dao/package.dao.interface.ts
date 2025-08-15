import { ResponseObject } from 'src/shared/types';
import { Package } from './package.entity';

export interface PackageDAOInterface {
  findAll(): Promise<ResponseObject>;
  findById(packageEntity: Package): Promise<ResponseObject>;
  create(packageEntity: Package): Promise<ResponseObject>;
  update(packageEntity: Package): Promise<ResponseObject>;
  updatePartial(id: string, patch: object): Promise<ResponseObject>;
  delete(packageEntity: Package): Promise<ResponseObject>;
  readTours(packageEntity: Package): Promise<ResponseObject>;
}
