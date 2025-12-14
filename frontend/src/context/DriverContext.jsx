import { createContext, useContext, useState, useCallback } from 'react';
import * as driverApi from '../api/driverApi';

const DriverContext = createContext();

export const useDrivers = () => {
    const context = useContext(DriverContext);
    if (!context) {
        throw new Error('useDrivers must be used within a DriverProvider');
    }
    return context;
};

export const DriverProvider = ({ children }) => {
    const [drivers, setDrivers] = useState([]);
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

    // Fetch all drivers with optional filters
    const fetchDrivers = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await driverApi.getDrivers(params);
            setDrivers(response.data);
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

    // Get single driver by ID
    const getDriverById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await driverApi.getDriverById(id);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new driver
    const createDriver = useCallback(async (driverData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await driverApi.createDriver(driverData);
            await fetchDrivers({ page: pagination.currentPage, limit: pagination.itemsPerPage });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchDrivers, pagination.currentPage, pagination.itemsPerPage]);

    // Update driver
    const updateDriver = useCallback(async (id, driverData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await driverApi.updateDriver(id, driverData);
            setDrivers(prevDrivers =>
                prevDrivers.map(driver =>
                    driver._id === id ? response.data : driver
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

    // Delete driver
    const deleteDriver = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await driverApi.deleteDriver(id);
            setDrivers(prevDrivers => prevDrivers.filter(driver => driver._id !== id));
            if (drivers.length === 1 && pagination.currentPage > 1) {
                await fetchDrivers({
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
    }, [drivers.length, pagination.currentPage, pagination.itemsPerPage, fetchDrivers]);

    const value = {
        drivers,
        loading,
        error,
        pagination,
        fetchDrivers,
        getDriverById,
        createDriver,
        updateDriver,
        deleteDriver,
        setError
    };

    return (
        <DriverContext.Provider value={value}>
            {children}
        </DriverContext.Provider>
    );
};

export default DriverContext;
