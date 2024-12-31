import { Injectable } from '@nestjs/common';
import { PackageDAOInterface } from './package.dao.interface';
import { Package } from './package.entity';
import { DataService } from 'src/shared/services/data.service';
import { FileServiceResponse, ResponseObject } from 'src/shared/types';
import { MultipartFile } from '@fastify/multipart';
import { FileService } from 'src/shared/services/file.service';
import { plainToInstance } from 'class-transformer';
import { FieldValue } from 'firebase-admin/firestore';

@Injectable()
export class PackageDAO implements PackageDAOInterface {
  private readonly collectionName = 'packages';
  private readonly imageStoragePath = 'packages';
  
  
  constructor(
      private readonly dataService: DataService,
      private readonly fileService: FileService,
    ) { }

  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  async findById(packageEntity: Package): Promise<ResponseObject> {
    return await this.dataService.readDoc(this.collectionName, packageEntity.id);
  }

  async create(packageEntity: Package): Promise<ResponseObject> {
    return this.dataService.createDoc(packageEntity, this.collectionName);
  }

  async update(packageEntity: Package): Promise<ResponseObject> {
    // Call the DataService's updateDoc method
    return await this.dataService.updateDoc(
      this.collectionName,
      packageEntity.id,
      packageEntity.toObject(),
    );
  }

  async delete(packageEntity: Package): Promise<ResponseObject> {
    return await this.dataService.deleteDoc(this.collectionName, packageEntity.id);
  }
}
