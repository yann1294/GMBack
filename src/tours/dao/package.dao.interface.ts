import { ResponseObject } from 'src/shared/types';
import { Package } from './package.entity';

export interface PackageDAOInterface {
  findAll(): Promise<ResponseObject>;
  findById(id: string): Promise<any>;
  create(data: Package): Promise<any>;
  update(id: string, data: Package): Promise<any>;
  delete(id: string, data?: Package): Promise<void>;
}
