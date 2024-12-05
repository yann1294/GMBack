import { UpdateTourDTO } from '../controller/dto/tour.update.dto';
import { TourVO } from '../vo/tour.master.vo';
import { Tour } from './tour.entity';

export interface CoreDAOInterface {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: Tour): Promise<any>;
  update(id: string, data: TourVO): Promise<any>;
  delete(id: string, data?: TourVO): Promise<void>;
}
