import { log } from 'console';
import { ITourService } from './tour.service.interface';
import { ITourDao } from '../dao/tour.dao.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TourService implements ITourService {
  constructor(private readonly tourDao: ITourDao) {}

  updateTour(name: string, id: string) {
    // do something with tourDao
    const result: string = this.tourDao.updateTour('id');
    log(result);
  }
}
