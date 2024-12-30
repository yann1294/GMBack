import { ResponseObject } from 'src/shared/types';
import { Package } from './package.entity';
import { MultipartFile } from '@fastify/multipart';

export interface PackageDAOInterface {
  findAll(): Promise<ResponseObject>;
  findById(id: string): Promise<ResponseObject>;
  create(data: Package): Promise<ResponseObject>;
  update(id: string, data: Package): Promise<ResponseObject>;
  delete(id: string, data?: Package): Promise<ResponseObject>;
}
