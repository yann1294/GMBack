import { Injectable } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceCondition, ResponseObject } from 'src/shared/types';
import IBookingServiceDAO from './booking.dao.interface';
import { Booking } from './booking.entity';

@Injectable()
export class BookingDAO implements IBookingServiceDAO {
  private readonly collectionName = 'bookings';

  constructor(private readonly dataService: DataService) {}

  async create(data: Booking): Promise<ResponseObject> {
    return this.dataService.createDoc(data, this.collectionName);
  }

  async findAllByTourist(id: string): Promise<ResponseObject> {
    return await this.dataService.readDocsWithCondition(this.collectionName, {
      fieldPath: 'tourist',
      operationString: 'array-contains',
      value: id,
    } as DataServiceCondition);
  }

  async findAllByGuide(id: string): Promise<ResponseObject> {
    // retrieving all tours guided by guide id
    let tours: ResponseObject = (await this.dataService.readDocsWithCondition(
      'tours',
      {
        fieldPath: 'guide',
        operationString: '==',
        value: id,
      } as DataServiceCondition,
    )) as ResponseObject;

    // creating a list of tour ids
    let tourIds: string[] = (tours.data as object[]).map((data) => data['id']);

    // retrive all bookings where resourceId is in tourIds
    return await this.dataService.readDocsWithCondition(this.collectionName, {
      fieldPath: 'resourceId',
      operationString: 'array-contains-any',
      value: tourIds,
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
