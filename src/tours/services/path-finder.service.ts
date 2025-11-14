import { Injectable } from '@nestjs/common';
import { PathFinderDAOInterface } from '../dao/path-finder.dao.interface';
import { IPathFinder } from './path-finder.interface';
import { Tour } from '../dao/tour.entity';
import { Activity } from '../vo/helper.vo';

@Injectable()
export class PathFinderService implements IPathFinder {
  // Inject DAO for any persistence or external routing data required
  constructor(private readonly pathFinderDAO: PathFinderDAOInterface) {}

  /**
   * Should provide live directions to clients (not implemented yet).
   */
  getDirections(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  /**
   * Should accept live location data from guide/device (not implemented yet).
   */
  provideDirections(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  /**
   * Should calculate distance and travel time between two activities (not implemented yet).
   */
  calculateDistance(start: Activity, end: Activity): Promise<any> {
    throw new Error('Method not implemented.');
  }
  /**
   * Should compute an ordered path (route) for a tour based on its activities (not implemented yet).
   */
  getTourPath(tour: Tour): Promise<any> {
    throw new Error('Method not implemented.');
  }

  /**
   * Example helper that delegates to DAO to find pre-computed path by location id.
   */
  findOptimalPath(locationId: string) {
    return this.pathFinderDAO.findPathByLocation(locationId);
  }
}

// =========================
// GPT - Questions
// Example design for a real-time location server without Firebase:
// - Use WebSockets (e.g. Socket.io) to broadcast location updates in memory.
// - Data is pushed directly between connected clients, avoiding database read/write cost.
// =========================

// const io = require('socket.io')(3000, {
//   cors: {
//     origin: "*", // Allow cross-origin requests
//   }
// });

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Receive live location updates from a device
//   socket.on('update-location', (location) => {
//     // Broadcast location to other connected clients
//     socket.broadcast.emit('location-updated', location);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000');

// // Send location updates
// navigator.geolocation.watchPosition((position) => {
//   const location = {
//     lat: position.coords.latitude,
//     lng: position.coords.longitude,
//   };
//   socket.emit('update-location', location);
// });

// // Receive live location updates
// socket.on('location-updated', (location) => {
//   console.log('New location received:', location);
// });
