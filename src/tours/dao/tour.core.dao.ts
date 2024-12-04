import { Injectable } from '@nestjs/common';
import { CoreDAOInterface } from './tour.core.dao.interface';
import { DataService } from 'src/shared/services/data.service';
//import { TourVO } from '../vo/tour.master.vo';
import { Tour } from './tour.entity';
import { UpdateTourDTO } from '../controller/dto/tour.update.dto';

@Injectable()
export class CoreDAO implements CoreDAOInterface {
  private readonly collectionName = 'tours';

  // private readonly tours = new Map<string, any>(); // Example in-memory storage

  constructor(private readonly dataService: DataService) {}

  // FIRST USE CASE:  CREATE A TOUR
  async create(data: Tour): Promise<any> {
    return this.dataService.createDoc(data, this.collectionName);
  }

  async findAll(): Promise<any> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  async findById(id: string): Promise<any> {
    return await this.dataService.readDoc(this.collectionName, id);
  }

  async update(id: string, data: UpdateTourDTO): Promise<any> {
    // Convert the UpdateTourDTO to a plain object or entity as needed
    const updatedData = { ...data };

    // Call the DataService's updateDoc method
    return await this.dataService.updateDoc(
      this.collectionName,
      id,
      updatedData,
    );
  }

  async delete(id: string): Promise<any> {
    // Call the DataService's deleteDoc method
    return await this.dataService.deleteDoc(this.collectionName, id);
  }
}
