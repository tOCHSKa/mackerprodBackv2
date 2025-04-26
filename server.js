import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import { connectToDb } from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { videoRoutes } from './routes/videoRoutes.js'; // CORRECT

dotenv.config();


const app = express();
app.use(bodyParser.json());

const corsOptions = {
    origin: ['https://www.mackerprod.com', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Utiliser CORS pour toutes les routes
app.use(cors(corsOptions));

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'BackEnd MackerProd',
            version: '0.0.1',
            description: '',
            contact: {
                name: 'Tochska',
            },
            servers: [{ url: 'https://www.mackerprod.com/' }]
        }
    },
    apis: ['./routes/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

connectToDb();

app.use('/api/videos', videoRoutes());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
