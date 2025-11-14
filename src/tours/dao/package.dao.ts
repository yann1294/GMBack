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
  /**
   * Read all tours referenced by a package.
   * Normalises the stored "tours" field (array or object) into an array of tour IDs
   * and performs a Firestore "in" query on the "tours" collection.
   */
  async readTours(packageEntity: Package): Promise<ResponseObject> {
    // read tour details
    // // 1) Fetch the package document itself
    let response: ResponseObject = await this.findById(packageEntity);
    if (response.status !== 'success') {
      return response;
    }
    // 2) Normalise the "tours" field to an array of string IDs
    let tourIds: string[] = [];

    const toursField = response.data['tours'];

    if (Array.isArray(toursField)) {
      tourIds = toursField; // ✅ correct shape
    } else if (toursField && typeof toursField === 'object') {
      // Legacy format: tours stored as object -> convert to array of values
      tourIds = Object.values(toursField); // ['T1','T2',…]
    }
    // 3) If no tours are attached, return an empty list
    if (tourIds.length === 0) {
      return {
        status: 'success',
        code: 200,
        message: 'Package has no tours',
        data: [],
      };
    }
    // 4) Query the "tours" collection for all matching IDs
    return await this.dataService.readDocsWithConditions('tours', {
      fieldPath: 'id',
      operationString: 'in',
      value: tourIds,
    } as DataServiceCondition);
  }

  /**
   * Return all package documents.
   */
  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  /**
   * Find a single package by its id.
   */
  async findById(packageEntity: Package): Promise<ResponseObject> {
    return await this.dataService.readDoc(
      this.collectionName,
      packageEntity.id,
    );
  }

  /**
   * Create a new package document in Firestore.
   */
  async create(packageEntity: Package): Promise<ResponseObject> {
    return this.dataService.createDoc(packageEntity, this.collectionName);
  }

  /**
   * Full update of a package document.
   * Uses Package.toObject(), then strips undefined values to avoid writing them.
   */
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

  /**
   * Partial update by id.
   * Accepts a patch object and persists only the provided fields.
   */
  async updatePartial(id: string, patch: object): Promise<ResponseObject> {
    const payload = stripUndefinedDeep(patch); // ✅ clean
    await this.dataService.updateDoc(this.collectionName, id, payload);
    return { status: 'success', code: 200, message: 'OK', data: null };
  }

  /**
   * Delete a package document.
   */
  async delete(packageEntity: Package): Promise<ResponseObject> {
    return await this.dataService.deleteDoc(
      this.collectionName,
      packageEntity.id,
    );
  }
}
