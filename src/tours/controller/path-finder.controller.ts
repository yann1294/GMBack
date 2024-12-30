import { Controller, Get, Param } from '@nestjs/common';
import { PathFinderService } from '../services/path-finder.service';

@Controller('path-finder')
export class PathFinderController {
  constructor(private readonly pathFinderService: PathFinderService) {}

  @Get(':locationId')
  findPath(@Param('locationId') locationId: string) {
    return this.pathFinderService.findOptimalPath(locationId);
  }
}
