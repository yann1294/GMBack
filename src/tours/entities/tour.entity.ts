import { Activity, TourLocation } from 'src/types';

export class Tour {
  id: string;
  name: string;
  location: TourLocation;
  price: number;
  durationDays: number;
  discount: number;
  isAvailable: boolean;
  guide: User;
  activities: Activity[];
}

interface User {
  name: string;
}
