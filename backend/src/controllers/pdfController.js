import * as pdfService from '../services/pdfService.js';

export const downloadTripPDF = async (req, res, next) => {
    try {
        const pdfBuffer = await pdfService.generateTripPDF(req.params.id);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=trip-${req.params.id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};