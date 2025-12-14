import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Reusable Table Component
 * 
 * @param {Array} columns - Array of column definitions [{key, label, sortable, render}]
 * @param {Array} data - Array of data objects
 * @param {Function} onEdit - Callback for edit action
 * @param {Function} onDelete - Callback for delete action
 * @param {Function} onView - Callback for view action (optional)
 * @param {Boolean} loading - Loading state
 * @param {String} emptyMessage - Message when no data
 */
const Table = ({
    columns = [],
    data = [],
    onEdit,
    onDelete,
    onView,
    loading = false,
    emptyMessage = 'No data available',
    actions = true
}) => {
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (columnKey) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortColumn) return 0;

        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === bValue) return 0;

        const comparison = aValue > bValue ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <div className="p-8">
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <div className="p-16 text-center">
                    <p className="text-gray-500 text-lg">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                        }`}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        {column.sortable && sortColumn === column.key && (
                                            sortDirection === 'asc' ?
                                                <ChevronUp className="h-4 w-4" /> :
                                                <ChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedData.map((row, index) => (
                            <tr key={row._id || index} className="hover:bg-gray-50 transition-colors">
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {onView && (
                                            <button
                                                onClick={() => onView(row)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
                {sortedData.map((row, index) => (
                    <div key={row._id || index} className="p-4 hover:bg-gray-50">
                        {columns.map((column) => (
                            <div key={column.key} className="flex justify-between py-2">
                                <span className="font-medium text-gray-700">{column.label}:</span>
                                <span className="text-gray-900">
                                    {column.render ? column.render(row) : row[column.key]}
                                </span>
                            </div>
                        ))}
                        {actions && (
                            <div className="flex justify-end space-x-4 mt-4 pt-4 border-t border-gray-200">
                                {onView && (
                                    <button
                                        onClick={() => onView(row)}
                                        className="text-blue-600 hover:text-blue-900 font-medium"
                                    >
                                        View
                                    </button>
                                )}
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(row)}
                                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(row)}
                                        className="text-red-600 hover:text-red-900 font-medium"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Table;
