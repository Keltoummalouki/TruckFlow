export const createBaseController = (service) => ({
    getAll: async (req, res, next) => {
        try {
            const { page, limit, sort, search } = req.query;

            // Extract filter params (anything not pagination-related)
            const filterParams = { ...req.query };
            delete filterParams.page;
            delete filterParams.limit;
            delete filterParams.sort;
            delete filterParams.search;

            const options = { page, limit, sort, search };
            const result = await service.getAll(filterParams, options);

            res.json({
                success: true,
                ...result  // Contains data and pagination
            });
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const data = await service.getById(req.params.id);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const data = await service.create(req.body);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const data = await service.update(req.params.id, req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            await service.delete(req.params.id);
            res.json({ success: true, message: 'Resource deleted' });
        } catch (error) {
            next(error);
        }
    },
});
