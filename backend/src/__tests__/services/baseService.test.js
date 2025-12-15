import { jest } from '@jest/globals';
import { createBaseService } from '../../services/baseService.js';

describe('BaseService', () => {
let mockModel, service;

beforeEach(() => {
    mockModel = {
        find: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }])
                    })
                })
            }),
            countDocuments: jest.fn().mockResolvedValue(2)
        }),
        countDocuments: jest.fn().mockResolvedValue(2),
        findById: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue({ id: '507f1f77bcf86cd799439011', name: 'Test' })
        }),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        create: jest.fn(),
    };
    service = createBaseService(mockModel);
});

describe('getAll', () => {
    it('devrait retourner tous les documents', async () => {
        const result = await service.getAll();

        expect(mockModel.find).toHaveBeenCalledWith({});
        expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
        expect(result.pagination).toBeDefined();
    });

    it('devrait appliquer un filtre', async () => {
        const filter = { status: 'active' };

        await service.getAll(filter);

        expect(mockModel.find).toHaveBeenCalledWith(filter);
    });
});

describe('getById', () => {
    it('devrait retourner un document par ID', async () => {
        const validId = '507f1f77bcf86cd799439011';

        const result = await service.getById(validId);

        expect(mockModel.findById).toHaveBeenCalledWith(validId);
        expect(result).toEqual({ id: validId, name: 'Test' });
    });

    it('devrait lancer une erreur si non trouvé', async () => {
        const validId = '507f1f77bcf86cd799439011';
        mockModel.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
        });

        await expect(service.getById(validId)).rejects.toThrow('Resource not found');
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
        const validId = '507f1f77bcf86cd799439011';
        const data = { name: 'Updated' };
        const mockUpdated = { id: validId, ...data };
        mockModel.findByIdAndUpdate.mockResolvedValue(mockUpdated);

        const result = await service.update(validId, data);

        expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(validId, data, { new: true, runValidators: true });
        expect(result).toEqual(mockUpdated);
    });

    it('devrait lancer une erreur si non trouvé', async () => {
        const validId = '507f1f77bcf86cd799439011';
        mockModel.findByIdAndUpdate.mockResolvedValue(null);

        await expect(service.update(validId, {})).rejects.toThrow('Resource not found');
    });
});

describe('delete', () => {
    it('devrait supprimer un document', async () => {
        const validId = '507f1f77bcf86cd799439011';
        const mockDeleted = { id: validId };
        mockModel.findByIdAndDelete.mockResolvedValue(mockDeleted);

        const result = await service.delete(validId);

        expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
        expect(result).toEqual(mockDeleted);
    });

    it('devrait lancer une erreur si non trouvé', async () => {
        const validId = '507f1f77bcf86cd799439011';
        mockModel.findByIdAndDelete.mockResolvedValue(null);

        await expect(service.delete(validId)).rejects.toThrow('Resource not found');
    });
});
});
