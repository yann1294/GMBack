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

import * as admin from 'firebase-admin';

@Injectable()
export class CoreDAO implements CoreDAOInterface {
  // Firestore collection for tours
  private readonly collectionName = 'tours';
  // Base storage path for tour images
  private readonly imageStoragePath = 'tours';

  constructor(
    private readonly dataService: DataService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Create a new tour document.
   */
  async create(tour: Tour): Promise<any> {
    return this.dataService.createDoc(tour, this.collectionName);
  }

  /**
   * Retrieve all tours from the collection.
   */
  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  /**
   * Find a tour document by id.
   */
  async findById(tour: Tour): Promise<any> {
    return await this.dataService.readDoc(this.collectionName, tour.id);
  }

  /**
   * Update an existing tour.
   * Uses Tour.toUpdateObject() to control how nested structures (activities) are persisted.
   */
  async update(tour: Tour): Promise<any> {
    // Call the DataService's updateDoc method
    return await this.dataService.updateDoc(
      this.collectionName,
      tour.id,
      tour.toUpdateObject(),
    );
  }

  /**
   * Delete a tour document by id.
   */ async delete(tour: Tour): Promise<any> {
    return await this.dataService.deleteDoc(this.collectionName, tour.id);
  }
}
