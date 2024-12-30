import { ResponseObject } from 'src/shared/types';
import { Tour } from './tour.entity';
import { MultipartFile } from '@fastify/multipart';

export interface CoreDAOInterface {
  findAll(): Promise<ResponseObject>;
  findById(id: string): Promise<ResponseObject>;
  create(data: Tour): Promise<ResponseObject>;
  update(id: string, data: Tour): Promise<ResponseObject>;
  delete(id: string, data?: Tour): Promise<ResponseObject>;
}
