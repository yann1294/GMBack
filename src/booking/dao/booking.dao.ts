import { Injectable } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceCondition, ResponseObject } from 'src/shared/types';
import IBookingDAO from './booking.dao.interface';
import { Booking } from './booking.entity';
import { Tourist } from 'src/user-management/dao/tourist.entity';
import { Guide } from 'src/user-management/dao/guide.entity';

@Injectable()
export class BookingDAO implements IBookingDAO {
  private readonly collectionName = 'bookings';

  constructor(private readonly dataService: DataService) { }

  async findAll(): Promise<ResponseObject> {
    return await this.dataService.readAllDocs(this.collectionName);
  }

  async create(booking: Booking): Promise<ResponseObject> {
    // checking whether booking for resource id already exist
    let response: ResponseObject = await this.dataService.readDocsWithConditions(
      this.collectionName,
      [
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
      ] as DataServiceCondition[],
    );

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
    return await this.dataService.createDoc(booking, this.collectionName);
  }

  async findByResourceId(booking: Booking): Promise<ResponseObject> {
    return await this.dataService.readDocsWithConditions(this.collectionName, {
      fieldPath: 'resourceId',
      operationString: '==',
      value: booking.resourceId,
    } as DataServiceCondition);
  }

  async findAllByTourist(tourist: Tourist): Promise<ResponseObject> {
    return await this.dataService.readDocsWithConditions(this.collectionName, {
      fieldPath: `tourists.${tourist.uid}.bookedOn`,
      operationString: '!=',
      value: null,
    } as DataServiceCondition);
  }

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

  async findById(booking: Booking): Promise<ResponseObject> {
    return await this.dataService.readDoc(this.collectionName, booking.id);
  }

  async update(booking: Booking): Promise<ResponseObject> {
    // Call the DataService's updateDoc method
    return await this.dataService.updateDoc(
      this.collectionName,
      booking.id,
      booking.toUpdateObject(),
    );
  }

  async delete(booking: Booking): Promise<ResponseObject> {
    // Call the DataService's deleteDoc method
    return await this.dataService.deleteDoc(this.collectionName, booking.id);
  }
}
