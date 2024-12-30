import { Injectable } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceCondition, ResponseObject } from 'src/shared/types';
import IBookingDAO from './booking.dao.interface';
import { Booking } from './booking.entity';

@Injectable()
export class BookingDAO implements IBookingDAO {
  private readonly collectionName = 'bookings';

  constructor(private readonly dataService: DataService) { }

  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  async create(data: Booking): Promise<ResponseObject> {
    // checking whether booking for resource id already exist
    let booking: ResponseObject = await this.dataService.readDocsWithConditions(
      this.collectionName,
      [
        // filters by resource Id
        {
          fieldPath: 'resourceId',
          operationString: '==',
          value: data.resourceId,
        },
        // filters by status
        {
          fieldPath: 'status',
          operationString: '==',
          value: 'in-process',
        },
      ] as DataServiceCondition[],
    );

    // check whether resource was found
    if ((booking.data as object[]).length !== 0) {
      // update tourist in booking
      return await this.dataService.updateDoc(
        this.collectionName,
        booking.data[0]['id'],
        {
          tourists: data.tourists,
        },
      );
    }

    // create new booking
    return await this.dataService.createDoc(data, this.collectionName);
  }

  async findByResourceId(resourceId: string): Promise<ResponseObject> {
    return await this.dataService.readDocsWithConditions(this.collectionName, {
      fieldPath: 'resourceId',
      operationString: '==',
      value: resourceId,
    } as DataServiceCondition);
  }

  async findAllByTourist(id: string): Promise<ResponseObject> {
    return await this.dataService.readDocsWithConditions(this.collectionName, {
      fieldPath: 'tourist',
      operationString: 'array-contains',
      value: id,
    } as DataServiceCondition);
  }

  async findAllByGuide(id: string): Promise<ResponseObject> {
    // retrieving all tours guided by guide id
    let tours: ResponseObject = (await this.dataService.readDocsWithConditions(
      'tours',
      {
        fieldPath: 'guide',
        operationString: '==',
        value: id,
      } as DataServiceCondition,
    )) as ResponseObject;

    // retrieving all packages guided by guide id
    let packages: ResponseObject =
      (await this.dataService.readDocsWithConditions('packages', {
        fieldPath: 'guide',
        operationString: '==',
        value: id,
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
        message: `Guide ${id} is not assigned to any tour or package`,
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

  async findById(id: string): Promise<ResponseObject> {
    return await this.dataService.readDoc(this.collectionName, id);
  }

  async update(id: string, data: Booking): Promise<ResponseObject> {
    // Call the DataService's updateDoc method
    return await this.dataService.updateDoc(
      this.collectionName,
      id,
      data.toUpdateObject(),
    );
  }

  // if only id is passed, then document id will be deleted.
  async delete(id: string, data?: Booking): Promise<ResponseObject> {
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
