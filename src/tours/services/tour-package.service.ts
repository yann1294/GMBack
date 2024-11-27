import { Injectable } from '@nestjs/common';
import { TourPackageDAOInterface } from './tour-package.dao.interface';
import { CreatePackageDTO, UpdatePackageDTO } from './dtos/package.dto';

@Injectable()
export class TourPackageService {
  constructor(private readonly tourPackageDAO: TourPackageDAOInterface) {}

  findAllPackages() {
    return this.tourPackageDAO.findAll();
  }

  findPackageById(id: string) {
    return this.tourPackageDAO.findById(id);
  }

  createPackage(createPackageDTO: CreatePackageDTO) {
    return this.tourPackageDAO.create(createPackageDTO);
  }

  updatePackage(id: string, updatePackageDTO: UpdatePackageDTO) {
    return this.tourPackageDAO.update(id, updatePackageDTO);
  }

  deletePackage(id: string) {
    return this.tourPackageDAO.delete(id);
  }

  addTourToPackage(packageId: string, tourId: string) {
    return this.tourPackageDAO.addTour(packageId, tourId);
  }

  removeTourFromPackage(packageId: string, tourId: string) {
    return this.tourPackageDAO.removeTour(packageId, tourId);
  }
}
