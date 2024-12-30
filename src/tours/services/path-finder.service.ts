import { Injectable } from '@nestjs/common';
import { PathFinderDAOInterface } from '../dao/path-finder.dao.interface';
import { IPathFinder } from './path-finder.interface';
import { Tour } from '../dao/tour.entity';
import { Activity } from '../vo/helper.vo';

@Injectable()
export class PathFinderService implements IPathFinder {
  constructor(private readonly pathFinderDAO: PathFinderDAOInterface) {}
  getDirections(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  provideDirections(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  calculateDistance(start: Activity, end: Activity): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getTourPath(tour: Tour): Promise<any> {
    throw new Error('Method not implemented.');
  }

  findOptimalPath(locationId: string) {
    return this.pathFinderDAO.findPathByLocation(locationId);
  }
}

// =========================
// GPT - Questions
// We want to implement a realtime server where we show life location of a device to another person. Since firebase charges based on reads and writes, it will be expensive to use firestore or realtime database. How could we implement this without relying on firebase
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
