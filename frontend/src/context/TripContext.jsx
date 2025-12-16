import { createContext, useContext, useState, useCallback } from 'react';
import * as tripApi from '../api/tripApi';

const TripContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTrips = () => {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrips must be used within a TripProvider');
    }
    return context;
};

export const TripProvider = ({ children }) => {
    const [trips, setTrips] = useState([]);
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

    // Fetch all trips with optional filters
    const fetchTrips = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tripApi.getTrips(params);
            setTrips(response.data);
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

    // Get single trip by ID
    const getTripById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tripApi.getTripById(id);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new trip
    const createTrip = useCallback(async (tripData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tripApi.createTrip(tripData);
            // Refresh the list after creation
            await fetchTrips({ page: pagination.currentPage, limit: pagination.itemsPerPage });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTrips, pagination.currentPage, pagination.itemsPerPage]);

    // Update trip
    const updateTrip = useCallback(async (id, tripData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tripApi.updateTrip(id, tripData);
            // Update the trip in the list
            setTrips(prevTrips =>
                prevTrips.map(trip =>
                    trip._id === id ? response.data : trip
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

    // Delete trip
    const deleteTrip = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await tripApi.deleteTrip(id);
            // Remove from the list
            setTrips(prevTrips => prevTrips.filter(trip => trip._id !== id));
            // Refresh list if needed
            if (trips.length === 1 && pagination.currentPage > 1) {
                await fetchTrips({
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
    }, [trips.length, pagination.currentPage, pagination.itemsPerPage, fetchTrips]);

    // Update trip status
    const updateTripStatus = useCallback(async (id, statusData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tripApi.updateTripStatus(id, statusData);
            // Update the trip in the list
            setTrips(prevTrips =>
                prevTrips.map(trip =>
                    trip._id === id ? response.data : trip
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

    // Search trips
    const searchTrips = useCallback(async (searchTerm, params = {}) => {
        return fetchTrips({ ...params, search: searchTerm });
    }, [fetchTrips]);

    // Get trips by driver
    const getTripsByDriver = useCallback(async (driverId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tripApi.getTripsByDriver(driverId);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get trips by status
    const getTripsByStatus = useCallback(async (status) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tripApi.getTripsByStatus(status);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        trips,
        loading,
        error,
        pagination,
        fetchTrips,
        getTripById,
        createTrip,
        updateTrip,
        deleteTrip,
        updateTripStatus,
        searchTrips,
        getTripsByDriver,
        getTripsByStatus,
        setError
    };

    return (
        <TripContext.Provider value={value}>
            {children}
        </TripContext.Provider>
    );
};

export default TripContext;
