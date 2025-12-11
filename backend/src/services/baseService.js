export const createBaseService = (model) => ({
    getAll: async (filter = {}, populate = '') => {
        return await model.find(filter).populate(populate);
    },

    getById: async (id, populate = '') => {
        const doc = await model.findById(id).populate(populate);
        if (!doc) throw new Error('Resource not found');
        return doc;
    },

    create: async (data) => {
        return await model.create(data);
    },

    update: async (id, data) => {
        const doc = await model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!doc) throw new Error('Resource not found');
        return doc;
    },

    delete: async (id) => {
        const doc = await model.findByIdAndDelete(id);
        if (!doc) throw new Error('Resource not found');
        return doc;
    },
});
