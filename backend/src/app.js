import express from 'express'
import cors from 'cors'
import { fileURLToPath } from "url";
import path from 'path';
import morgan from 'morgan';
import helmet from "helmet";

import logger from './logger/logger.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from "./middlewares/errorHandler.js";

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from "./routes/authRoutes.js";



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json()); // parse JSON request bodies into req.body
// arse URL-encoded bodies (HTML forms)
app.use(express.urlencoded({ extended : true })) // extended: true lets it parse nested objects (qs library) instead of simple strings
app.use(helmet()); // Sécurise les headers HTTP

// import.meta.url: URL of the current module
const __filename = fileURLToPath(import.meta.url);
// current folder -> full path
const __dirname = path.dirname(__filename); // path.dirname: func returns parentDirectory(folder) of a file.

const morganFormat = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined';

app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

app.get('/', (req, res) => {
    logger.info('Home route accessed');
    res.send('TruckFlow running...');
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;