import { ResponseObject } from 'src/shared/types';
import { Tour } from './tour.entity';
import { MultipartFile } from '@fastify/multipart';

/**
 * DAO contract for core Tour persistence operations.
 */
export interface CoreDAOInterface {
  findAll(): Promise<ResponseObject>;
  findById(data: Tour): Promise<ResponseObject>;
  create(data: Tour): Promise<ResponseObject>;
  update(data: Tour): Promise<ResponseObject>;
  delete(data: Tour): Promise<ResponseObject>;
}
