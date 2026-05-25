import express from 'express';

import rotasLeituraSensor from './routes/leitura-sensor.routes.js';

const app = express();
const porta = process.env.PORTA_BACKEND || 3000;

app.use(express.json());

app.use('/api', rotasLeituraSensor);

app.listen(porta, () => {
    console.log(`Backend executando no domínio http://localhost:${porta}`);
});
