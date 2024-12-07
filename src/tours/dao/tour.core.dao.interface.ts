import { Tour } from './tour.entity';

export interface CoreDAOInterface {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: Tour): Promise<any>;
  update(id: string, data: Tour): Promise<any>;
  delete(id: string, data?: Tour): Promise<void>;
}
