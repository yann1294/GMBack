import { Injectable } from '@nestjs/common';
import { PackageDAOInterface } from './package.dao.interface';
import { Package } from './package.entity';
import { DataService } from 'src/shared/services/data.service';
import {
  DataServiceCondition,
  FileServiceResponse,
  ResponseObject,
} from 'src/shared/types';
import { MultipartFile } from '@fastify/multipart';
import { FileService } from 'src/shared/services/file.service';
import { plainToInstance } from 'class-transformer';
import { FieldValue } from 'firebase-admin/firestore';
import { stripUndefinedDeep } from 'src/shared/utils/stripUndefined';

@Injectable()
export class PackageDAO implements PackageDAOInterface {
  private readonly collectionName = 'packages';
  private readonly imageStoragePath = 'packages';

  constructor(
    private readonly dataService: DataService,
    private readonly fileService: FileService,
  ) {}
  async readTours(packageEntity: Package): Promise<ResponseObject> {
    // read tour details
    // // 1) Fetch the package document itself
    let response: ResponseObject = await this.findById(packageEntity);
    if (response.status !== 'success') {
      return response;
    }
    /* 2) Normalise the tours field into an array ------------- */
    let tourIds: string[] = [];

    const toursField = response.data['tours'];

    if (Array.isArray(toursField)) {
      tourIds = toursField; // ✅ correct shape
    } else if (toursField && typeof toursField === 'object') {
      // older docs saved an object ⇒ convert to array of values (or keys)
      tourIds = Object.values(toursField); // ['T1','T2',…]
    }
    /* 3) If there is nothing to fetch, return early ---------- */
    if (tourIds.length === 0) {
      return {
        status: 'success',
        code: 200,
        message: 'Package has no tours',
        data: [],
      };
    }
    /* 4) Otherwise run the IN query -------------------------- */
    // read tour documents
    return await this.dataService.readDocsWithConditions('tours', {
      fieldPath: 'id',
      operationString: 'in',
      value: tourIds,
    } as DataServiceCondition);
  }

  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  async findById(packageEntity: Package): Promise<ResponseObject> {
    return await this.dataService.readDoc(
      this.collectionName,
      packageEntity.id,
    );
  }

  async create(packageEntity: Package): Promise<ResponseObject> {
    return this.dataService.createDoc(packageEntity, this.collectionName);
  }

  async update(packageEntity: Package): Promise<ResponseObject> {
    // Call the DataService's updateDoc method
    console.log('Updating packageEntity', packageEntity);
    const payload = stripUndefinedDeep(packageEntity.toObject()); // ✅ clean
    return await this.dataService.updateDoc(
      this.collectionName,
      packageEntity.id,
      payload,
    );
  }

  // package.dao.ts
  async updatePartial(id: string, patch: object): Promise<ResponseObject> {
    const payload = stripUndefinedDeep(patch); // ✅ clean
    await this.dataService.updateDoc(this.collectionName, id, payload);
    return { status: 'success', code: 200, message: 'OK', data: null };
  }

  async delete(packageEntity: Package): Promise<ResponseObject> {
    return await this.dataService.deleteDoc(
      this.collectionName,
      packageEntity.id,
    );
  }
}
