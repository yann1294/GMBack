import { Tour } from "../dao/tour.entity";
import { Activity } from "../vo/helper.vo";

export interface IPathFinder {
    getDirections(): Promise<any>; // Provides real-time location update of guide's location.
    provideDirections(): Promise<any>; // Gets near-real-time location data from guide to be used in getDirections.
    calculateDistance(start: Activity, end: Activity): Promise<any>; // Calculates the length of the shortest distance between two activities and returns the distance and an estimated time.
    getTourPath(tour: Tour): Promise<any>; // Takes a tour, extract its activities and using the calculateDistance function to compute the distance between two points. Can use sliding window to access two activities at a time, with a stride of 1. 
}