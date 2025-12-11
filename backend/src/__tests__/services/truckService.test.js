import { jest } from '@jest/globals';

const mockTruckModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
};

jest.unstable_mockModule('../../models/truckModel.js', () => ({
  default: mockTruckModel,
}));

const { getAll, getById, create, update, deleteTruck, getAvailableTrucks, assignDriver, unassignDriver } = await import('../../services/truckService.js');

describe('TruckService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('devrait retourner tous les camions', async () => {
      const mockTrucks = [{ id: 1 }, { id: 2 }];
      mockTruckModel.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTrucks),
      });

      const result = await getAll();

      expect(mockTruckModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockTrucks);
    });
  });

  describe('getById', () => {
    it('devrait retourner un camion par ID', async () => {
      const mockTruck = { id: '123', licensePlate: 'ABC123' };
      mockTruckModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTruck),
      });

      const result = await getById('123');

      expect(mockTruckModel.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockTruck);
    });

    it('devrait lancer une erreur si non trouvé', async () => {
      mockTruckModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(getById('999')).rejects.toThrow('Resource not found');
    });
  });

  describe('create', () => {
    it('devrait créer un nouveau camion', async () => {
      const data = { licensePlate: 'XYZ789' };
      const mockCreated = { id: '123', ...data };
      mockTruckModel.create.mockResolvedValue(mockCreated);

      const result = await create(data);

      expect(mockTruckModel.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockCreated);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un camion', async () => {
      const data = { status: 'maintenance' };
      const mockUpdated = { id: '123', ...data };
      mockTruckModel.findByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await update('123', data);

      expect(mockTruckModel.findByIdAndUpdate).toHaveBeenCalledWith('123', data, { new: true, runValidators: true });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteTruck', () => {
    it('devrait supprimer un camion', async () => {
      const mockDeleted = { id: '123' };
      mockTruckModel.findByIdAndDelete.mockResolvedValue(mockDeleted);

      const result = await deleteTruck('123');

      expect(mockTruckModel.findByIdAndDelete).toHaveBeenCalledWith('123');
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
      const mockUpdated = { id: '123', driver: '456', status: 'in_use' };
      mockTruckModel.findByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await assignDriver('123', '456');

      expect(mockTruckModel.findByIdAndUpdate).toHaveBeenCalledWith('123', { driver: '456', status: 'in_use' }, { new: true, runValidators: true });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('unassignDriver', () => {
    it('devrait désassigner un chauffeur d\'un camion', async () => {
      const mockUpdated = { id: '123', driver: null, status: 'available' };
      mockTruckModel.findByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await unassignDriver('123');

      expect(mockTruckModel.findByIdAndUpdate).toHaveBeenCalledWith('123', { driver: null, status: 'available' }, { new: true, runValidators: true });
      expect(result).toEqual(mockUpdated);
    });
  });
});
