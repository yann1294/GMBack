import { CreatePackageDTO, UpdatePackageDTO } from './dtos/package.dto';

export interface TourPackageDAOInterface {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: CreatePackageDTO): Promise<any>;
  update(id: string, data: UpdatePackageDTO): Promise<any>;
  delete(id: string): Promise<void>;
  addTour(packageId: string, tourId: string): Promise<any>;
  removeTour(packageId: string, tourId: string): Promise<any>;
}
