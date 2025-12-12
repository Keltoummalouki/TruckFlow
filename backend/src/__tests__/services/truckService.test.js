import { jest } from '@jest/globals';

const mockTruckModel = {
  find: jest.fn(),
};

const mockBaseService = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.unstable_mockModule('../../models/truckModel.js', () => ({
  default: mockTruckModel,
}));

jest.unstable_mockModule('../../services/baseService.js', () => ({
  createBaseService: jest.fn(() => mockBaseService),
}));

const { getAll, getById, create, update, deleteTruck, getAvailableTrucks, assignDriver, unassignDriver } = await import('../../services/truckService.js');

describe('TruckService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('devrait retourner tous les camions', async () => {
      const mockTrucks = [{ id: 1 }, { id: 2 }];
      mockBaseService.getAll.mockResolvedValue(mockTrucks);

      const result = await getAll();

      expect(mockBaseService.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockTrucks);
    });
  });

  describe('getById', () => {
    it('devrait retourner un camion par ID', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const mockTruck = { id: validId, licensePlate: 'ABC123' };
      mockBaseService.getById.mockResolvedValue(mockTruck);

      const result = await getById(validId);

      expect(mockBaseService.getById).toHaveBeenCalledWith(validId, 'driver');
      expect(result).toEqual(mockTruck);
    });

    it('devrait lancer une erreur si non trouvé', async () => {
      const validId = '507f1f77bcf86cd799439011';
      mockBaseService.getById.mockRejectedValue(new Error('Resource not found'));

      await expect(getById(validId)).rejects.toThrow('Resource not found');
    });
  });

  describe('create', () => {
    it('devrait créer un nouveau camion', async () => {
      const data = { licensePlate: 'XYZ789' };
      const mockCreated = { id: '123', ...data };
      mockBaseService.create.mockResolvedValue(mockCreated);

      const result = await create(data);

      expect(mockBaseService.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockCreated);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un camion', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const data = { status: 'maintenance' };
      const mockUpdated = { id: validId, ...data };
      mockBaseService.update.mockResolvedValue(mockUpdated);

      const result = await update(validId, data);

      expect(mockBaseService.update).toHaveBeenCalledWith(validId, data);
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteTruck', () => {
    it('devrait supprimer un camion', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const mockDeleted = { id: validId };
      mockBaseService.delete.mockResolvedValue(mockDeleted);

      const result = await deleteTruck(validId);

      expect(mockBaseService.delete).toHaveBeenCalledWith(validId);
      expect(result).toEqual(mockDeleted);
    });
  });

  describe('getAvailableTrucks', () => {
    it('devrait retourner les camions disponibles', async () => {
      const mockTrucks = [{ id: 1, status: 'available' }];
      mockTruckModel.find.mockResolvedValue(mockTrucks);

      const result = await getAvailableTrucks();

      expect(mockTruckModel.find).toHaveBeenCalledWith({ status: 'available' });
      expect(result).toEqual(mockTrucks);
    });
  });

  describe('assignDriver', () => {
    it('devrait assigner un chauffeur à un camion', async () => {
      const truckId = '507f1f77bcf86cd799439011';
      const driverId = '507f1f77bcf86cd799439012';
      const mockUpdated = { id: truckId, driver: driverId, status: 'in_use' };
      mockBaseService.update.mockResolvedValue(mockUpdated);

      const result = await assignDriver(truckId, driverId);

      expect(mockBaseService.update).toHaveBeenCalledWith(truckId, { driver: driverId, status: 'in_use' });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('unassignDriver', () => {
    it('devrait désassigner un chauffeur d\'un camion', async () => {
      const truckId = '507f1f77bcf86cd799439011';
      const mockUpdated = { id: truckId, driver: null, status: 'available' };
      mockBaseService.update.mockResolvedValue(mockUpdated);

      const result = await unassignDriver(truckId);

      expect(mockBaseService.update).toHaveBeenCalledWith(truckId, { driver: null, status: 'available' });
      expect(result).toEqual(mockUpdated);
    });
  });
});
