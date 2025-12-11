import { jest } from '@jest/globals';
import { createBaseService } from '../../services/baseService.js';

describe('BaseService', () => {
let mockModel, service;

beforeEach(() => {
    mockModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    };
    service = createBaseService(mockModel);
});

describe('getAll', () => {
    it('devrait retourner tous les documents', async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    mockModel.populate.mockResolvedValue(mockData);

    const result = await service.getAll();

    expect(mockModel.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockData);
    });

    it('devrait appliquer un filtre', async () => {
    const filter = { status: 'active' };
    mockModel.populate.mockResolvedValue([]);

    await service.getAll(filter);

    expect(mockModel.find).toHaveBeenCalledWith(filter);
    });
});

describe('getById', () => {
    it('devrait retourner un document par ID', async () => {
    const mockDoc = { id: '123', name: 'Test' };
    mockModel.populate.mockResolvedValue(mockDoc);

    const result = await service.getById('123');

    expect(mockModel.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockDoc);
    });

    it('devrait lancer une erreur si non trouvé', async () => {
    mockModel.populate.mockResolvedValue(null);

    await expect(service.getById('999')).rejects.toThrow('Resource not found');
    });
});

describe('create', () => {
    it('devrait créer un nouveau document', async () => {
    const data = { name: 'New Item' };
    const mockCreated = { id: '123', ...data };
    mockModel.create.mockResolvedValue(mockCreated);

    const result = await service.create(data);

    expect(mockModel.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(mockCreated);
    });
});

describe('update', () => {
    it('devrait mettre à jour un document', async () => {
    const data = { name: 'Updated' };
    const mockUpdated = { id: '123', ...data };
    mockModel.findByIdAndUpdate.mockResolvedValue(mockUpdated);

    const result = await service.update('123', data);

    expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith('123', data, { new: true, runValidators: true });
    expect(result).toEqual(mockUpdated);
    });

    it('devrait lancer une erreur si non trouvé', async () => {
    mockModel.findByIdAndUpdate.mockResolvedValue(null);

    await expect(service.update('999', {})).rejects.toThrow('Resource not found');
    });
});

describe('delete', () => {
    it('devrait supprimer un document', async () => {
    const mockDeleted = { id: '123' };
    mockModel.findByIdAndDelete.mockResolvedValue(mockDeleted);

    const result = await service.delete('123');

    expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockDeleted);
    });

    it('devrait lancer une erreur si non trouvé', async () => {
    mockModel.findByIdAndDelete.mockResolvedValue(null);

    await expect(service.delete('999')).rejects.toThrow('Resource not found');
    });
});
});
