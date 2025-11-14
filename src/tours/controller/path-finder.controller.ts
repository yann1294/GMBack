import { Controller, Get, Param } from '@nestjs/common';
import { PathFinderService } from '../services/path-finder.service';

/**
 * PathFinderController
 * - Simple controller exposing path-finding operations over HTTP.
 */
@Controller('path-finder')
export class PathFinderController {
  constructor(private readonly pathFinderService: PathFinderService) {}

  /**
   * GET /path-finder/:locationId
   * - Lookup the optimal path for a given locationId.
   * - Delegates logic to PathFinderService.
   */
  @Get(':locationId')
  findPath(@Param('locationId') locationId: string) {
    return this.pathFinderService.findOptimalPath(locationId);
  }
}
