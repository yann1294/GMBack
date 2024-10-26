import { Controller, Delete, Get, Post } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { DataServiceCondition, DataServiceResponse } from 'src/types';

@Controller('tours')
export class TourController {
  // inject firebase repository
  constructor(private dataService: DataService) {}

  @Post('create')
  async createTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.createDocs(
      [{ name: 'Test repo' }, { name: 'Test repo' }, { name: 'Test repo' }],
      'tours',
    );
    return result;
  }

  @Get('read')
  async getTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.readDoc(
      'tours',
      'srntBzfHL3sP4gzqKrOus',
    );
    return result;
  }

  @Delete('delete')
  async deleteTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.deleteDoc(
      'tours',
      'srntBzfHL3sP4gzqKrOus',
    );
    return result;
  }
}
