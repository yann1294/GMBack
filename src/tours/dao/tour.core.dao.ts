import { Injectable } from '@nestjs/common';
import { CoreDAOInterface } from './core.dao.interface';
import { CreateTourDTO, UpdateTourDTO } from './dtos/tour.dto';

@Injectable()
export class CoreDAO implements CoreDAOInterface {
  private readonly tours = new Map<string, any>(); // Example in-memory storage

  async findAll(): Promise<any[]> {
    return Array.from(this.tours.values());
  }

  async findById(id: string): Promise<any> {
    return this.tours.get(id) || null;
  }

  async create(data: CreateTourDTO): Promise<any> {
    this.tours.set(data.id, data);
    return data;
  }

  async update(id: string, data: UpdateTourDTO): Promise<any> {
    const existing = this.tours.get(id);
    if (!existing) throw new Error('Tour not found');
    const updated = { ...existing, ...data };
    this.tours.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.tours.delete(id);
  }
}
