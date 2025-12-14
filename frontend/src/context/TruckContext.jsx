import { createContext, useContext, useState, useCallback } from 'react';
import * as truckApi from '../api/truckApi';

const TruckContext = createContext();

export const useTrucks = () => {
    const context = useContext(TruckContext);
    if (!context) {
        throw new Error('useTrucks must be used within a TruckProvider');
    }
    return context;
};

export const TruckProvider = ({ children }) => {
    const [trucks, setTrucks] = useState([]);
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

    // Fetch all trucks with optional filters
    const fetchTrucks = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await truckApi.getTrucks(params);
            setTrucks(response.data);
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

    // Get single truck by ID
    const getTruckById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await truckApi.getTruckById(id);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new truck
    const createTruck = useCallback(async (truckData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await truckApi.createTruck(truckData);
            // Refresh the list after creation
            await fetchTrucks({ page: pagination.currentPage, limit: pagination.itemsPerPage });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTrucks, pagination.currentPage, pagination.itemsPerPage]);

    // Update truck
    const updateTruck = useCallback(async (id, truckData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await truckApi.updateTruck(id, truckData);
            // Update the truck in the list
            setTrucks(prevTrucks =>
                prevTrucks.map(truck =>
                    truck._id === id ? response.data : truck
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

    // Delete truck
    const deleteTruck = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await truckApi.deleteTruck(id);
            // Remove from the list
            setTrucks(prevTrucks => prevTrucks.filter(truck => truck._id !== id));
            // Refresh list if needed
            if (trucks.length === 1 && pagination.currentPage > 1) {
                // If this was the last item on the current page, go to previous page
                await fetchTrucks({
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
    }, [trucks.length, pagination.currentPage, pagination.itemsPerPage, fetchTrucks]);

    // Search trucks
    const searchTrucks = useCallback(async (searchTerm, params = {}) => {
        return fetchTrucks({ ...params, search: searchTerm });
    }, [fetchTrucks]);

    // Get available trucks
    const getAvailableTrucks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await truckApi.getAvailableTrucks();
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        trucks,
        loading,
        error,
        pagination,
        fetchTrucks,
        getTruckById,
        createTruck,
        updateTruck,
        deleteTruck,
        searchTrucks,
        getAvailableTrucks,
        setError
    };

    return (
        <TruckContext.Provider value={value}>
            {children}
        </TruckContext.Provider>
    );
};

export default TruckContext;
