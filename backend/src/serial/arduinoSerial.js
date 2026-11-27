import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

import { registrarLeituraService } from "../services/leitura.service.js";
import { buscarDashboardAmbiente } from "../models/dashboard.model.js";


let serialConectada = false;
let ultimaMensagemArduino = null;

export function obterStatusArduino() {
  const habilitado = process.env.ENABLE_SERIAL === "true";

  return {
    habilitado,
    conectado: habilitado && serialConectada,
    porta: process.env.ARDUINO_SERIAL_PORT || null,
    ultima_mensagem: ultimaMensagemArduino,
  };
}


export function interpretarLinhaSerial(linha) {
  const texto = linha.trim();

  if (!texto) {
    return null;
  }

  console.log("Recebido do Arduino:", texto);

  if (texto.startsWith("{")) {
  let dados;

  try {
    dados = JSON.parse(texto);
  } catch (erro) {
    console.warn("JSON inválido recebido do Arduino:", texto);
    return null;
  }

  const sensorId = dados?.sensorId ?? dados?.id_sensor;

  if (
    sensorId === null ||
    sensorId === undefined ||
    String(sensorId).trim() === "" ||
    !Number.isSafeInteger(Number(sensorId)) ||
    Number(sensorId) <= 0
  ) {
    console.warn("ID de sensor inválido recebido do Arduino.");
    return null;
  }

  return Number(sensorId);
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
    serialConectada = true;
    console.log(`Serial conectada em ${porta} com baud rate ${baudRate}`);
  });

  serial.on("close", () => {
    serialConectada = false;
    console.log("Conexão serial encerrada.");
  });


  serial.on("error", (error) => {
    console.error("Erro na porta serial:", error.message);
  });
    // Envia comandos do backend para o Arduino
  function enviarComandoArduino(comando) {
    if (!serial.isOpen) {
      console.warn("Porta serial fechada. Comando não enviado:", comando);
      return;
    }

    serial.write(`${comando}\n`, (erro) => {
      if (erro) {
        console.error("Erro ao enviar comando ao Arduino:", erro.message);
        return;
      }

      console.log("Comando enviado ao Arduino:", comando);
    });
  }
  // Processa as mensagens do Arduino em sequência
  let filaProcessamento = Promise.resolve();

  parser.on("data", (linha) => {
    ultimaMensagemArduino = new Date().toISOString();

  filaProcessamento = filaProcessamento.then(async () => {
    try {
      // Aguarda o Arduino informar que terminou a inicialização
      if (linha.trim() === "ARDUINO_READY") {
        const dashboard = await buscarDashboardAmbiente(1);

        const ocupacaoAtual = dashboard.ocupacao_atual;
        const capacidadeMaxima = dashboard.ambiente.max_pessoas;

        const comando =
          ocupacaoAtual > capacidadeMaxima
            ? "BUZZER_ON"
            : "BUZZER_OFF";

        enviarComandoArduino(comando);

        console.log(
          `Buzzer sincronizado após ARDUINO_READY: ${ocupacaoAtual}/${capacidadeMaxima}`
        );

        return;
      }
      const sensorId = interpretarLinhaSerial(linha);

      if (!sensorId) {
        return;
      }

      const resultado = await registrarLeituraService({
        sensorId,
        origem: "SERIAL_USB",
      });
    // Verifica a lotação oficial registrada no MySQL
  const ocupacaoAtual = resultado.ocupacao.ocupacao_atual;
  const capacidadeMaxima = resultado.ambiente.max_pessoas;

  // Envia o comando ao Arduino conforme a lotação
  if (ocupacaoAtual > capacidadeMaxima) {
     enviarComandoArduino("BUZZER_ON");
    } else {
  enviarComandoArduino("BUZZER_OFF");
      }    
      console.log(
        `Leitura registrada: ${resultado.leitura.tipo} | Ocupação: ${resultado.ocupacao.ocupacao_atual}/${resultado.ambiente.max_pessoas}`
      );
        } catch (error) {
      console.error("Erro ao processar leitura serial:", error);
    }
  });
});
}