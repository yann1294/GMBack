import { Inject, Injectable } from '@nestjs/common';
import { PackageDAOInterface } from '../dao/package.dao.interface';
import { IPackageService } from './package.service.interface';
import { PACKAGE_DAO_INTERFACE_TOKEN } from '../token';
import { PackageVO } from '../vo/package.master.vo';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Package } from '../dao/package.entity';
import { ResponseObject } from 'src/shared/types';
import { FieldValue } from 'firebase-admin/firestore';
import { MultipartFile } from '@fastify/multipart';
// import { deleteImage, uploadImages } from '../utils/upload-images.util';

@Injectable()
export class PackageService implements IPackageService {
  // Inject DAO implementation via its DI token to respect the interface abstraction
  constructor(
    @Inject(PACKAGE_DAO_INTERFACE_TOKEN)
    private readonly packageDAO: PackageDAOInterface,
  ) {}
  /**
   * Retrieve all packages from the data store.
   */
  async findAllPackages(): Promise<ResponseObject> {
    return await this.packageDAO.findAll();
  }

  /**
   * Find a single package by its id.
   * Accepts a VO, converts it to an Entity and delegates to the DAO.
   */
  findPackageById(packageVo: PackageVO) {
    return this.packageDAO.findById(packageVo.toEntity());
  }

  /**
   * Create a new package using the VO as input.
   */
  createPackage(packageVo: PackageVO) {
    return this.packageDAO.create(packageVo.toEntity());
  }

  /**
   * Apply partial updates to a package.
   * Only the specified fields in `patch` will be updated.
   */
  updatePackage(packageVo: PackageVO) {
    const patch: any = {
      name: packageVo.name,
      price: packageVo.price,
      images: packageVo.images,
      durationDays: packageVo.durationDays,
      discount: packageVo.discount,
      numberOfSeats: packageVo.numberOfSeats,
      description: packageVo.description,
      isAvailable: packageVo.isAvailable,
      date: packageVo.date,
      guide: packageVo.guide,
      location: packageVo.location,
      // Note: tours intentionally excluded here; managed via add/remove tour methods.
    };
    return this.packageDAO.updatePartial(packageVo.id, patch);
  }

  /**
   * Delete a package entirely from the data store.
   */
  deletePackage(packageVo: PackageVO) {
    return this.packageDAO.delete(packageVo.toEntity());
  }

  /**
   * Read all tours attached to a given package.
   */
  async readTours(packageVo: PackageVO): Promise<ResponseObject> {
    return await this.packageDAO.readTours(packageVo.toEntity());
  }

  /**
   * Replace the list of tours associated with a package.
   * Validates that `tours` is an array of strings.
   */
  async addTourToPackage(packageVo: PackageVO): Promise<ResponseObject> {
    const { id, tours } = packageVo;

    if (!Array.isArray(tours) || !tours.every((t) => typeof t === 'string')) {
      return {
        status: 'failure',
        code: 400,
        message: 'tours must be an array of strings',
        data: null,
      };
    }
    return await this.packageDAO.updatePartial(id, { tours });
  }

  /**
   * Remove one or more tours from an existing package.
   * Uses Firestore's arrayRemove to delete specific tour ids.
   */
  async removeTourFromPackage(packageVo: PackageVO): Promise<ResponseObject> {
    // let packageVo: PackageVO = new PackageVO();
    // packageVo.id = tourId;
    return await this.packageDAO.update(
      plainToInstance(Package, {
        tours: FieldValue.arrayRemove(...packageVo.tours),
      }),
    );
  }

  /**
   * Assign or update the guide assigned to a package.
   */
  async assignGuideToPackage(packageVo: PackageVO): Promise<ResponseObject> {
    return await this.packageDAO.update(packageVo.toEntity());
  }

  /**
   * Update only the availability flag (and any subset of fields) for a package.
   */
  async updatePackageAvailability(
    packageVo: PackageVO,
  ): Promise<ResponseObject> {
    return await this.packageDAO.update(packageVo.toEntity());
  }
}
