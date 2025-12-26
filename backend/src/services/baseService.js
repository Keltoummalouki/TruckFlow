import mongoose from 'mongoose';

export const createBaseService = (model) => ({
    getAll: async (filter = {}, populate = '', options = {}) => {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            search = '',
            searchFields = []
        } = options;

        // Build search query if search term and fields provided
        let query = { ...filter };
        if (search && searchFields.length > 0) {
            query.$or = searchFields.map(field => ({
                [field]: { $regex: search, $options: 'i' }
            }));
        }

        const skip = (page - 1) * limit;

        // Execute query with pagination
        const results = await model
            .find(query)
            .populate(populate)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await model.countDocuments(query);

        return {
            data: results,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        };
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

    update: async (id, data, populate = '') => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Resource not found');
        }
        const doc = await model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(populate);
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
