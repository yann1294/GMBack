import { Test, TestingModule } from '@nestjs/testing';
import { CORE_SERVICE_TOKEN } from '../token';
import { ICoreService } from '../services/tour.service.interface';
import { TourVO } from '../vo/tour.master.vo';
import { ResponseObject } from 'src/shared/types';
import { TourController } from './core.controller';

describe('TourController', () => {
  let controller: TourController;
  let coreService: jest.Mocked<ICoreService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourController],
      providers: [
        {
          provide: CORE_SERVICE_TOKEN,
          useValue: {
            createTour: jest.fn(),
            findTourById: jest.fn(),
            updateTour: jest.fn(),
            findAllTours: jest.fn(),
            deleteTour: jest.fn(),
            updateTourAvailability: jest.fn(),
            assignGuideToTour: jest.fn(),
            addActivityToTour: jest.fn(),
            removeActivityFromTour: jest.fn(),
            listActivitiesForTour: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TourController>(TourController);
    coreService = module.get(CORE_SERVICE_TOKEN);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTour', () => {
    it('should create a tour and return a response object', async () => {
      const mockTourVO: TourVO = { id: '1', name: 'Test Tour' }; // Simplified TourVO for test
      const mockResponse: ResponseObject = { success: true };

      coreService.createTour.mockResolvedValue(mockResponse);

      const result = await controller.createTour(mockTourVO);
      expect(coreService.createTour).toHaveBeenCalledWith(mockTourVO);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findById', () => {
    it('should find a tour by ID and return a response object', async () => {
      const mockResponse: ResponseObject = { success: true, data: { id: '1' } };

      coreService.findTourById.mockResolvedValue(mockResponse);

      const result = await controller.findById('1');
      expect(coreService.findTourById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update a tour and return a response object', async () => {
      const mockTourVO: TourVO = { id: '1', name: 'Updated Tour' };
      const mockResponse: ResponseObject = { success: true };

      coreService.updateTour.mockResolvedValue(mockResponse);

      const result = await controller.update('1', mockTourVO);
      expect(coreService.updateTour).toHaveBeenCalledWith('1', mockTourVO);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAllTours', () => {
    it('should return all tours', async () => {
      const mockResponse: ResponseObject = { success: true, data: [] };

      coreService.findAllTours.mockResolvedValue(mockResponse);

      const result = await controller.findAllTours();
      expect(coreService.findAllTours).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteTour', () => {
    it('should delete a tour and return a response object', async () => {
      const mockResponse: ResponseObject = { success: true };

      coreService.deleteTour.mockResolvedValue(mockResponse);

      const result = await controller.deleteTour('1');
      expect(coreService.deleteTour).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateTourAvailability', () => {
    it('should update tour availability and return a response object', async () => {
      const mockRequestBody = { tourId: '1', isAvailable: true };
      const mockResponse: ResponseObject = { success: true };

      coreService.updateTourAvailability.mockResolvedValue(mockResponse);

      const result = await controller.updateTourAvailability(mockRequestBody);
      expect(coreService.updateTourAvailability).toHaveBeenCalledWith(
        '1',
        true,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('assignGuideToTour', () => {
    it('should assign a guide to a tour and return a response object', async () => {
      const mockRequestBody = { tourId: '1', guideId: '123' };
      const mockResponse: ResponseObject = { success: true };

      coreService.assignGuideToTour.mockResolvedValue(mockResponse);

      const result = await controller.assignGuideToTour(mockRequestBody);
      expect(coreService.assignGuideToTour).toHaveBeenCalledWith('1', '123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('addActivityToTour', () => {
    it('should add an activity to a tour and return a response object', async () => {
      const mockTourVO: TourVO = { id: '1', name: 'Tour with Activity' };
      const mockResponse: ResponseObject = { success: true };

      coreService.addActivityToTour.mockResolvedValue(mockResponse);

      const result = await controller.addActivityToTour(mockTourVO);
      expect(coreService.addActivityToTour).toHaveBeenCalledWith(mockTourVO);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeActivityFromTour', () => {
    it('should remove an activity from a tour and return a response object', async () => {
      const mockRequestBody = { tourId: '1', activityId: '101' };
      const mockResponse: ResponseObject = { success: true };

      coreService.removeActivityFromTour.mockResolvedValue(mockResponse);

      const result = await controller.removeActivityFromTour(mockRequestBody);
      expect(coreService.removeActivityFromTour).toHaveBeenCalledWith(
        '1',
        '101',
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('listActivitiesForTour', () => {
    it('should list activities for a tour and return a response object', async () => {
      const mockResponse: ResponseObject = { success: true, data: [] };

      coreService.listActivitiesForTour.mockResolvedValue(mockResponse);

      const result = await controller.listActivitiesForTour('1');
      expect(coreService.listActivitiesForTour).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResponse);
    });
  });
});
