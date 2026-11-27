
import { prisma } from "../lib/prisma.js";
import { obterStatusArduino } from "../serial/arduinoSerial.js";

export async function consultarStatusSistema(req, res) {
  let bancoConectado = false;
  let ultimaLeitura = null;

  try {
    await prisma.$queryRaw`SELECT 1`;
    bancoConectado = true;

    // Consulta a última leitura registrada pelos sensores.
    ultimaLeitura = await prisma.leitura.findFirst({
      orderBy: {
        data_hora: "desc",
      },
      select: {
        data_hora: true,
        origem: true,
      },
    });
  } catch (erro) {
    console.error("Erro ao verificar o MySQL e as leituras:", erro);
  }

  return res.json({
    dados: {
      api: "online",
      mysql: bancoConectado ? "conectado" : "desconectado",
      arduino: obterStatusArduino(),
      ultima_leitura: ultimaLeitura,
      verificado_em: new Date().toISOString(),
    },
  });
}
