import { Injectable } from '@nestjs/common';
import { CoreDAOInterface } from './tour.core.dao.interface';
import { DataService } from 'src/shared/services/data.service';
//import { TourVO } from '../vo/tour.master.vo';
import { Tour } from './tour.entity';
import { FileServiceResponse, ResponseObject } from 'src/shared/types';
import { MultipartFile } from '@fastify/multipart';
import { FileService } from 'src/shared/services/file.service';
import { FieldValue } from 'firebase-admin/firestore';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CoreDAO implements CoreDAOInterface {
  private readonly collectionName = 'tours';
  private readonly imageStoragePath = 'tours';

  constructor(
    private readonly dataService: DataService,
    private readonly fileService: FileService,
  ) { }

  // FIRST USE CASE:  CREATE A TOUR
  async create(data: Tour): Promise<any> {
    return this.dataService.createDoc(data, this.collectionName);
  }

  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  async findById(id: string): Promise<any> {
    return await this.dataService.readDoc(this.collectionName, id);
  }

  async update(id: string, data: Tour): Promise<any> {
    // Call the DataService's updateDoc method  
    return await this.dataService.updateDoc(
      this.collectionName,
      id,
      data.toUpdateObject(),
    );
  }

  // if only id is passed, then document id will be deleted.
  async delete(id: string, data?: Tour): Promise<any> {
    // Call the DataService's deleteDoc method
    if (data) {
      return await this.dataService.updateDoc(
        this.collectionName,
        id,
        data.toDeleteObject(),
      );
    }
    return await this.dataService.deleteDoc(this.collectionName, id);
  }
}
