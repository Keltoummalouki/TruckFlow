import { createContext, useContext, useState, useCallback } from 'react';
import * as trailerApi from '../api/trailerApi';

const TrailerContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTrailers = () => {
    const context = useContext(TrailerContext);
    if (!context) {
        throw new Error('useTrailers must be used within a TrailerProvider');
    }
    return context;
};

export const TrailerProvider = ({ children }) => {
    const [trailers, setTrailers] = useState([]);
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

    const fetchTrailers = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await trailerApi.getTrailers(params);
            setTrailers(response.data);
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

    const getTrailerById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await trailerApi.getTrailerById(id);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createTrailer = useCallback(async (trailerData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await trailerApi.createTrailer(trailerData);
            await fetchTrailers({ page: pagination.currentPage, limit: pagination.itemsPerPage });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTrailers, pagination.currentPage, pagination.itemsPerPage]);

    const updateTrailer = useCallback(async (id, trailerData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await trailerApi.updateTrailer(id, trailerData);
            setTrailers(prevTrailers =>
                prevTrailers.map(trailer =>
                    trailer._id === id ? response.data : trailer
                )
            );
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTrailer = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await trailerApi.deleteTrailer(id);
            setTrailers(prevTrailers => prevTrailers.filter(trailer => trailer._id !== id));
            if (trailers.length === 1 && pagination.currentPage > 1) {
                await fetchTrailers({
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
    }, [trailers.length, pagination.currentPage, pagination.itemsPerPage, fetchTrailers]);

    const value = {
        trailers,
        loading,
        error,
        pagination,
        fetchTrailers,
        getTrailerById,
        createTrailer,
        updateTrailer,
        deleteTrailer,
        setError
    };

    return (
        <TrailerContext.Provider value={value}>
            {children}
        </TrailerContext.Provider>
    );
};

export default TrailerContext;
