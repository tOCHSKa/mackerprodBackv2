const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { connectToDb } = require('./db.js');
const { videoRoutes } = require('./routes/videoRoutes.js');
const { userRoutes } = require('./routes/userRoutes.js');
const { setupApp } = require('./scriptStarter/setupApp.js');
const { messageRoutes} = require('./routes/messageRoutes.js');

dotenv.config();

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

setupApp();

app.use('/api/video', videoRoutes());
app.use('/api/users', userRoutes());
app.use('/api/message', messageRoutes());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
