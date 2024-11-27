import { Injectable } from '@nestjs/common';
import { PathFinderDAOInterface } from './path-finder.dao.interface';

@Injectable()
export class PathFinderService {
  constructor(private readonly pathFinderDAO: PathFinderDAOInterface) {}

  findOptimalPath(locationId: string) {
    return this.pathFinderDAO.findPathByLocation(locationId);
  }
}
