import { createContext, useContext, useState, useCallback } from 'react';
import * as tireApi from '../api/tireApi';

const TireContext = createContext();

export const useTires = () => {
    const context = useContext(TireContext);
    if (!context) {
        throw new Error('useTires must be used within a TireProvider');
    }
    return context;
};

export const TireProvider = ({ children }) => {
    const [tires, setTires] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
    });

    const fetchTires = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tireApi.getTires(params);
            setTires(response.data);
            if (response.pagination) {
                setPagination(response.pagination);
            }
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getTireById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tireApi.getTireById(id);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createTire = useCallback(async (tireData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tireApi.createTire(tireData);
            await fetchTires({ page: pagination.currentPage, limit: pagination.itemsPerPage });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTires, pagination.currentPage, pagination.itemsPerPage]);

    const updateTire = useCallback(async (id, tireData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tireApi.updateTire(id, tireData);
            setTires(prevTires =>
                prevTires.map(tire => tire._id === id ? response.data : tire)
            );
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTire = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await tireApi.deleteTire(id);
            setTires(prevTires => prevTires.filter(tire => tire._id !== id));
            if (tires.length === 1 && pagination.currentPage > 1) {
                await fetchTires({
                    page: pagination.currentPage - 1,
                    limit: pagination.itemsPerPage
                });
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [tires.length, pagination.currentPage, pagination.itemsPerPage, fetchTires]);

    const value = {
        tires,
        loading,
        error,
        pagination,
        fetchTires,
        getTireById,
        createTire,
        updateTire,
        deleteTire,
        setError
    };

    return (
        <TireContext.Provider value={value}>
            {children}
        </TireContext.Provider>
    );
};

export default TireContext;
