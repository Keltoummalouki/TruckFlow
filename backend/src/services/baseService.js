import mongoose from 'mongoose';

export const createBaseService = (model) => ({
    getAll: async (filter = {}, populate = '') => {
        return await model.find(filter).populate(populate);
    },

    getById: async (id, populate = '') => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Resource not found');
        }
        const doc = await model.findById(id).populate(populate);
        if (!doc) throw new Error('Resource not found');
        return doc;
    },

    create: async (data) => {
        return await model.create(data);
    },

    update: async (id, data) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Resource not found');
        }
        const doc = await model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!doc) throw new Error('Resource not found');
        return doc;
    },

    delete: async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Resource not found');
        }
        const doc = await model.findByIdAndDelete(id);
        if (!doc) throw new Error('Resource not found');
        return doc;
    },
});
