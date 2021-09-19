const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();


//Creando servidor/app de express
const app = express();

// Base de datos
dbConnection();

//Public directory
app.use(express.static('public'));

//CORS
app.use(cors());

//Lectura y parsing del body
app.use(express.json());



//Rutas
app.use('/api/auth', require('./routes/auth'));

app.listen(process.env.API_PORT, () => {
    console.log(`Server started in port ${ process.env.API_PORT }`);
})