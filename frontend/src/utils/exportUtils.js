/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (data, filename = 'export.csv') => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        // Headers row
        headers.join(','),
        // Data rows
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Handle values that might contain commas, quotes, or newlines
                if (value === null || value === undefined) return '';
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            }).join(',')
        )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export multiple datasets to separate CSV files
 * @param {Array} datasets - Array of {data, filename} objects
 */
export const exportMultipleToCSV = (datasets) => {
    datasets.forEach(({ data, filename }) => {
        exportToCSV(data, filename);
    });
};

/**
 * Format date for export
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForExport = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Export reports data to PDF
 * @param {Object} data - Data object with trips, maintenance, trucks arrays
 */
export const exportReportsToPDF = async (data) => {
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.jsPDF;
    const autoTableModule = await import('jspdf-autotable');

    const doc = new jsPDF();

    // Apply autoTable plugin
    const autoTable = autoTableModule.default;

    const timestamp = new Date().toISOString().split('T')[0];
    let yPos = 20;

    // Title
    doc.setFontSize(18);
    doc.text('TruckFlow Fleet Management Report', 14, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, yPos);
    yPos += 15;

    // Trips table
    if (data.trips && data.trips.length > 0) {
        doc.setFontSize(14);
        doc.text('Trips Report', 14, yPos);
        autoTable(doc, {
            startY: yPos + 5,
            head: [['Truck', 'Driver', 'Route', 'Date', 'Status', 'Fuel']],
            body: data.trips.map(t => [
                t.truck?.licensePlate || t.truck?.registrationNumber || 'N/A',
                t.driver ? `${t.driver.firstName} ${t.driver.lastName}` : 'N/A',
                `${t.startLocation || t.departureLoc} → ${t.endLocation || t.arrivalLoc}`,
                new Date(t.scheduledDeparture).toLocaleDateString(),
                t.status,
                `${t.fuelVolume || 0}L`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 8 }
        });
        yPos = doc.lastAutoTable.finalY + 15;
    }

    // Check for new page
    if (yPos > 200) { doc.addPage(); yPos = 20; }

    // Maintenance table
    if (data.maintenance && data.maintenance.length > 0) {
        doc.setFontSize(14);
        doc.text('Maintenance Report', 14, yPos);
        autoTable(doc, {
            startY: yPos + 5,
            head: [['Type', 'Target', 'Date', 'Cost', 'Status']],
            body: data.maintenance.map(m => [
                m.type.replace('_', ' '),
                m.targetType,
                new Date(m.date).toLocaleDateString(),
                `$${m.cost}`,
                m.status
            ]),
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 8 }
        });
        yPos = doc.lastAutoTable.finalY + 15;
    }

    // Check for new page
    if (yPos > 200) { doc.addPage(); yPos = 20; }

    // Fleet table
    if (data.trucks && data.trucks.length > 0) {
        doc.setFontSize(14);
        doc.text('Fleet Report', 14, yPos);
        autoTable(doc, {
            startY: yPos + 5,
            head: [['License', 'Brand', 'Model', 'Year', 'Capacity', 'Status']],
            body: data.trucks.map(t => [
                t.licensePlate,
                t.brand,
                t.model,
                t.year,
                `${t.capacity} tons`,
                t.status
            ]),
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 8 }
        });
    }

    doc.save(`truckflow-report-${timestamp}.pdf`);
};
