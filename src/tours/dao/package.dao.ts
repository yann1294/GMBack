import { Injectable } from '@nestjs/common';
import { TourPackageDAOInterface } from './package.dao.interface';
import { CreatePackageDTO, UpdatePackageDTO } from '../controller/dto/package.dto';

@Injectable()
export class TourPackageDAO implements TourPackageDAOInterface {
  private readonly packages = new Map<string, { id: string; name: string; tours: string[] }>();

  async findAll(): Promise<any[]> {
    return Array.from(this.packages.values());
  }

  async findById(id: string): Promise<any> {
    return this.packages.get(id) || null;
  }

  async create(data: CreatePackageDTO): Promise<any> {
    this.packages.set(data.id, { ...data, tours: [] });
    return this.packages.get(data.id);
  }

  async update(id: string, data: UpdatePackageDTO): Promise<any> {
    const existing = this.packages.get(id);
    if (!existing) throw new Error('Package not found');
    const updated = { ...existing, ...data };
    this.packages.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.packages.delete(id);
  }

  async addTour(packageId: string, tourId: string): Promise<any> {
    const pkg = this.packages.get(packageId);
    if (!pkg) throw new Error('Package not found');
    if (!pkg.tours.includes(tourId)) {
      pkg.tours.push(tourId);
    }
    return pkg;
  }

  async removeTour(packageId: string, tourId: string): Promise<any> {
    const pkg = this.packages.get(packageId);
    if (!pkg) throw new Error('Package not found');
    pkg.tours = pkg.tours.filter((id) => id !== tourId);
    return pkg;
  }
}
