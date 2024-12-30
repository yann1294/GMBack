export interface PathFinderDAOInterface {
    findPathByLocation(locationId: string): Promise<any>;
  }
  