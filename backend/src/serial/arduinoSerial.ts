import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

import { registrarLeituraService } from "../services/leitura.service.js";

function interpretarLinhaSerial(linha: string): number | null {
  const texto = linha.trim();

  if (!texto) {
    return null;
  }

  console.log("Recebido do Arduino:", texto);

  if (texto.startsWith("{")) {
    const dados = JSON.parse(texto) as {
      sensorId?: number;
      id_sensor?: number;
    };

    return dados.sensorId ?? dados.id_sensor ?? null;
  }

  if (texto === "ENTRADA") {
    return Number(process.env.SENSOR_ENTRADA_ID || 1);
  }

  if (texto === "SAIDA") {
    return Number(process.env.SENSOR_SAIDA_ID || 2);
  }

  return null;
}

export function iniciarLeituraSerial() {
  const porta = process.env.ARDUINO_SERIAL_PORT;
  const baudRate = Number(process.env.ARDUINO_BAUD_RATE || 9600);

  if (!porta) {
    console.log("ARDUINO_SERIAL_PORT não configurada no .env");
    return;
  }

  const serial = new SerialPort({
    path: porta,
    baudRate,
  });

  const parser = serial.pipe(
    new ReadlineParser({
      delimiter: "\n",
    })
  );

  serial.on("open", () => {
    console.log(`Serial conectada em ${porta} com baud rate ${baudRate}`);
  });

  serial.on("error", (error: Error) => {
    console.error("Erro na porta serial:", error.message);
  });

  parser.on("data", async (linha: string) => {
    try {
      const sensorId = interpretarLinhaSerial(linha);

      if (!sensorId) {
        return;
      }

      const resultado = await registrarLeituraService({
        sensorId,
        origem: "SERIAL_USB",
      });

      console.log(
        `Leitura registrada: ${resultado.leitura.tipo} | Ocupação: ${resultado.ocupacao.ocupacao_atual}/${resultado.ambiente.max_pessoas}`
      );
    } catch (error) {
      console.error("Erro ao processar leitura serial:", error);
    }
  });
}