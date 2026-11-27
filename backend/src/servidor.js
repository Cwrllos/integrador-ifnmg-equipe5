import "dotenv/config";

import app from "./app.js";
import { iniciarLeituraSerial } from "./serial/arduinoSerial.js";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`URL local: http://localhost:${PORT}`);

  if (process.env.ENABLE_SERIAL === "true") {
    iniciarLeituraSerial();
  } else {
    console.log("Leitura serial desativada. Use ENABLE_SERIAL=true para ativar.");
  }
});