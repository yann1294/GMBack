import { UpdateTourDTO } from '../controller/dto/tour.update.dto';
import { Tour } from './tour.entity';

export interface CoreDAOInterface {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: Tour): Promise<any>;
  update(id: string, data: UpdateTourDTO): Promise<any>;
  delete(id: string): Promise<void>;
}
