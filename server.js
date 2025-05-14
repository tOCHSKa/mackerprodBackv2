import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import { connectToDb } from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { videoRoutes } from './routes/videoRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { createAdminIfNotExists } from './scriptStarter/createAdminIfNotExists.js';
import { createTableUsers } from './scriptStarter/createTableUsers.js';
import { createDatabase } from './scriptStarter/createDatabase.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// const corsOptions = {
//     origin: ['https://www.mackerprod.com', 'http://localhost:8080', 'http://localhost:3000'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };

app.use(cors());

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

createDatabase();
createTableUsers();
createAdminIfNotExists();

app.use('/api/videos', videoRoutes());
app.use('/api/users', userRoutes());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
