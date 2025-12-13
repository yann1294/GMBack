import { Injectable } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceCondition, ResponseObject } from 'src/shared/types';
import IBookingDAO from './booking.dao.interface';
import { Booking } from './booking.entity';
import { Tourist } from 'src/user-management/dao/tourist.entity';
import { Guide } from 'src/user-management/dao/guide.entity';

/**
 * BookingDAO
 * - Low-level persistence adapter for the `bookings` collection.
 * - Delegates all Firestore operations to DataService.
 */
@Injectable()
export class BookingDAO implements IBookingDAO {
  private readonly collectionName = 'bookings';

  constructor(private readonly dataService: DataService) {}

  /**
   * Return all bookings.
   */
  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  /**
   * Create a new booking or append tourists to an existing "in-process" booking
   * for the same resourceId.
   */
  async create(booking: Booking): Promise<ResponseObject> {
    // checking whether booking for resource id already exist
    let response: ResponseObject =
      await this.dataService.readDocsWithConditions(this.collectionName, [
        // filters by resource Id
        {
          fieldPath: 'resourceId',
          operationString: '==',
          value: booking.resourceId,
        },
        // filters by status
        {
          fieldPath: 'status',
          operationString: '==',
          value: 'in-process',
        },
      ] as DataServiceCondition[]);

    // check whether resource was found
    if ((response.data as object[]).length !== 0) {
      // update tourist in booking
      return await this.dataService.updateDoc(
        this.collectionName,
        response.data[0]['id'],
        {
          tourists: booking.tourists,
        },
      );
    }

    // create new booking
    console.log('Data to enter into the DB ', booking);
    return await this.dataService.createDoc(booking, this.collectionName);
  }

  /**
   * Find bookings for a specific resource (tour/package) by resourceId.
   */
  async findByResourceId(booking: Booking): Promise<ResponseObject> {
    return await this.dataService.readDocsWithConditions(this.collectionName, {
      fieldPath: 'resourceId',
      operationString: '==',
      value: booking.resourceId,
    } as DataServiceCondition);
  }

  /**
   * Return all bookings where the given tourist has a non-null bookedOn field.
   */
  async findAllByTourist(tourist: Tourist): Promise<ResponseObject> {
    return await this.dataService.readDocsWithConditions(this.collectionName, {
      fieldPath: `tourists.${tourist.uid}.bookedOn`,
      operationString: '!=',
      value: null,
    } as DataServiceCondition);
  }

  /**
   * Fetch all bookings for tours/packages guided by a given guide.
   */
  async findAllByGuide(guide: Guide): Promise<ResponseObject> {
    // retrieving all tours guided by guide id
    let tours: ResponseObject = (await this.dataService.readDocsWithConditions(
      'tours',
      {
        fieldPath: 'guide',
        operationString: '==',
        value: guide.uid,
      } as DataServiceCondition,
    )) as ResponseObject;

    // retrieving all packages guided by guide id
    let packages: ResponseObject =
      (await this.dataService.readDocsWithConditions('packages', {
        fieldPath: 'guide',
        operationString: '==',
        value: guide.uid,
      } as DataServiceCondition)) as ResponseObject;

    // creating a list of tour ids and package ids
    let tourIds: string[] = (tours.data as object[]).map((data) => data['id']);
    let packageIds: string[] = (packages.data as object[]).map(
      (data) => data['id'],
    );

    // check if guide has any tours
    if (tourIds.length === 0 && packageIds.length === 0) {
      return {
        status: 'success',
        code: 200,
        message: `Guide ${guide.uid} is not assigned to any tour or package`,
        data: [],
      };
    }

    // retrieve all bookings where resourceId is in tourIds
    return await this.dataService.readDocsWithConditions(this.collectionName, {
      fieldPath: 'resourceId',
      operationString: 'in',
      value: [...tourIds, ...packageIds],
    } as DataServiceCondition);
  }

  /**
   * Read a booking by id.
   */
  async findById(booking: Booking): Promise<ResponseObject> {
    return await this.dataService.readDoc(this.collectionName, booking.id);
  }

  /**
   * Persist updates for a booking.
   */
  async update(booking: Booking): Promise<ResponseObject> {
    // Call the DataService's updateDoc method
    return await this.dataService.updateDoc(
      this.collectionName,
      booking.id,
      booking.toUpdateObject(),
    );
  }

  /**
   * Delete a booking document.
   */
  async delete(booking: Booking): Promise<ResponseObject> {
    // Call the DataService's deleteDoc method
    return await this.dataService.deleteDoc(this.collectionName, booking.id);
  }

  /**
   * Flexible entry to query bookings with arbitrary condition(s).
   */
  async findByCondition(
    condition: DataServiceCondition | DataServiceCondition[],
  ): Promise<ResponseObject> {
    return await this.dataService.readDocsWithConditions(
      this.collectionName,
      condition,
    );
  }

  /**
   * Lookup a resource (tour/package) by its collection name and id.
   * Used by pricing/availability logic.
   */
  async findResource(
    resourceType: string,
    resourceId: string,
  ): Promise<ResponseObject> {
    return await this.dataService.readDoc(resourceType, resourceId);
  }
}
