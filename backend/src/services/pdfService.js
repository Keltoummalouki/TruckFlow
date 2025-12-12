import PDFDocument from 'pdfkit';
import * as tripService from './tripService.js';

export const generateTripPDF = async (tripId) => {
    const trip = await tripService.getById(tripId);
    
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header
            doc.fontSize(20).text('ORDRE DE MISSION', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.moveDown(2);

            // Trip Information
            doc.fontSize(14).text('Informations du Trajet', { underline: true });
            doc.moveDown();
            doc.fontSize(10);
            doc.text(`Départ: ${trip.departureLoc}`);
            doc.text(`Arrivée: ${trip.arrivalLoc}`);
            doc.text(`Date prévue: ${new Date(trip.scheduledDeparture).toLocaleString()}`);
            doc.text(`Statut: ${trip.status}`);
            doc.moveDown(2);

            // Driver Information
            doc.fontSize(14).text('Chauffeur', { underline: true });
            doc.moveDown();
            doc.fontSize(10);
            if (trip.driver) {
                doc.text(`Nom: ${trip.driver.firstName} ${trip.driver.lastName}`);
                doc.text(`Email: ${trip.driver.email}`);
            }
            doc.moveDown(2);

            // Truck Information
            doc.fontSize(14).text('Véhicule', { underline: true });
            doc.moveDown();
            doc.fontSize(10);
            if (trip.truck) {
                doc.text(`Immatriculation: ${trip.truck.registrationNumber}`);
                doc.text(`Marque: ${trip.truck.brand}`);
                doc.text(`Kilométrage actuel: ${trip.truck.currentMileage} km`);
            }
            doc.moveDown(2);

            // Trip Details
            if (trip.startMileage || trip.endMileage || trip.fuelVolume) {
                doc.fontSize(14).text('Détails du Trajet', { underline: true });
                doc.moveDown();
                doc.fontSize(10);
                if (trip.startMileage) doc.text(`Kilométrage départ: ${trip.startMileage} km`);
                if (trip.endMileage) doc.text(`Kilométrage arrivée: ${trip.endMileage} km`);
                if (trip.fuelVolume) doc.text(`Carburant consommé: ${trip.fuelVolume} L`);
                doc.moveDown(2);
            }

            // Comments
            if (trip.comments) {
                doc.fontSize(14).text('Commentaires', { underline: true });
                doc.moveDown();
                doc.fontSize(10);
                doc.text(trip.comments);
                doc.moveDown(2);
            }

            // Footer
            doc.moveDown(3);
            doc.fontSize(10);
            doc.text('Signature du chauffeur:', { continued: false });
            doc.moveDown(3);
            doc.text('_________________________');

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
