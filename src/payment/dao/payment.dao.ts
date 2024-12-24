import { ITourDao } from './payment.dao.interface';

class TourDao implements ITourDao {
  updateTour(id: string): string {
    return 'Yay!!! updated' + id;
  }
}
