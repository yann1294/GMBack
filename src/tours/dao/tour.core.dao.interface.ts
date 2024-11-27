import { CreateTourDTO, UpdateTourDTO } from './dtos/tour.dto';

export interface CoreDAOInterface {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: CreateTourDTO): Promise<any>;
  update(id: string, data: UpdateTourDTO): Promise<any>;
  delete(id: string): Promise<void>;
}
