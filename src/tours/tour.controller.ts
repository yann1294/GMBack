import { Controller, Get, Post } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceResponse } from 'src/types';

@Controller('tours')
export class TourController {
  // inject firebase repository
  constructor(private dataService: DataService) {}

  @Post('create')
  async createTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.createRecords(
      [{ name: 'Test repo' }, { name: 'Test repo' }, { name: 'Test repo' }],
      'tours',
    );
    return result;
  }

  @Get('read')
  async getTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.readRecord(
      'tours',
      'srntBzfHL3sP4gzqKrOu',
    );
    return result;
  }
}
