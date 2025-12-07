/**
 * DAO contract for path-finding related storage/queries.
 */
export interface PathFinderDAOInterface {
  findPathByLocation(locationId: string): Promise<any>;
}
