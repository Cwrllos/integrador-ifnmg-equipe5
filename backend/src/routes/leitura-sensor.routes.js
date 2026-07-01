import express from 'express';

import{
    receberLeituraSensor,
    buscarLeituraSensor,
    buscarUltimaLeitura
} from '../controllers/leitura-sensor.controller.js';

const rotasLeituraSensor = express.Router();

rotasLeituraSensor.post('/leituras-sensores', receberLeituraSensor);
rotasLeituraSensor.get('/leituras-sensores', buscarLeituraSensor);
rotasLeituraSensor.get('/leituras-sensores', buscarUltimaLeitura);

export default rotasLeituraSensor;
