// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

dotenv.config();

const { videoRoutes } = require('./routes/videoRoutes.js');
const { messageRoutes } = require('./routes/messageRoutes.js');
const { adminRoutes } = require('./routes/adminRoutes.js');
const { utilisateurRoutes } = require('./routes/userRoutes.js');

const app = express();
app.use(bodyParser.json());

const corsOptions = {
    origin: ['https://www.mackerprod.com', 'http://localhost:8080', 'http://localhost:3000', 'https://fontshare.netlify.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'BackEnd MackerProd',
            version: '0.0.1',
            contact: {
                name: 'Tochska',
            },
        }
    },
    apis: ['./routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/video', videoRoutes());
app.use('/api/admin', adminRoutes());
app.use('/api/message', messageRoutes());
app.use('/api/utilisateur', utilisateurRoutes());

module.exports = app;
