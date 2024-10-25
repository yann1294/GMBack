import { Controller, Post } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceResponse } from 'src/types';

@Controller('tours')
export class TourController {
  // inject firebase repository
  constructor(private dataService: DataService) {}

  @Post('create')
  async createTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.createRecord(
      { name: 'Test repo' },
      'tours',
    );
    return result;
  }
}
