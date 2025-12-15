import { createContext, useContext, useState, useCallback } from 'react';
import * as maintenanceApi from '../api/maintenanceApi';

const MaintenanceContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMaintenances = () => {
    const context = useContext(MaintenanceContext);
    if (!context) {
        throw new Error('useMaintenances must be used within a MaintenanceProvider');
    }
    return context;
};

export const MaintenanceProvider = ({ children }) => {
    const [maintenances, setMaintenances] = useState([]);
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

    const fetchMaintenances = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await maintenanceApi.getMaintenances(params);
            setMaintenances(response.data);
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

    const getMaintenanceById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await maintenanceApi.getMaintenanceById(id);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createMaintenance = useCallback(async (maintenanceData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await maintenanceApi.createMaintenance(maintenanceData);
            await fetchMaintenances({ page: pagination.currentPage, limit: pagination.itemsPerPage });
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchMaintenances, pagination.currentPage, pagination.itemsPerPage]);

    const updateMaintenance = useCallback(async (id, maintenanceData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await maintenanceApi.updateMaintenance(id, maintenanceData);
            setMaintenances(prevMaintenances =>
                prevMaintenances.map(maintenance =>
                    maintenance._id === id ? response.data : maintenance
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

    const deleteMaintenance = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await maintenanceApi.deleteMaintenance(id);
            setMaintenances(prevMaintenances => prevMaintenances.filter(m => m._id !== id));
            if (maintenances.length === 1 && pagination.currentPage > 1) {
                await fetchMaintenances({
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
    }, [maintenances.length, pagination.currentPage, pagination.itemsPerPage, fetchMaintenances]);

    const value = {
        maintenances,
        loading,
        error,
        pagination,
        fetchMaintenances,
        getMaintenanceById,
        createMaintenance,
        updateMaintenance,
        deleteMaintenance,
        setError
    };

    return (
        <MaintenanceContext.Provider value={value}>
            {children}
        </MaintenanceContext.Provider>
    );
};

export default MaintenanceContext;
