
import { prisma } from "../lib/prisma.js";

export async function registrarLeituraService({
  sensorId,
  tipoRecebido,
  origem = "API",
}) {
  const MAX_TENTATIVAS = 3;

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    try {
      return await prisma.$transaction(async (tx) => {
        const sensor = await tx.sensor.findUnique({
          where: {
            id_sensor: Number(sensorId),
          },
          include: {
            ambiente: true,
          },
        });

        if (!sensor) {
          throw new Error("SENSOR_NAO_ENCONTRADO");
        }

        // A validação de sensor ativo poderá ser
        // implementada quando o campo existir no banco.

        if (tipoRecebido && tipoRecebido !== sensor.tipo) {
          throw new Error("TIPO_SENSOR_INVALIDO");
        }

        // Registra a leitura no banco de dados.
        const leitura = await tx.leitura.create({
          data: {
            tipo: sensor.tipo,
            id_sensor: sensor.id_sensor,
            id_ambiente: sensor.id_ambiente,
            origem,
          },
        });

        // Garante que exista um registro de ocupação.
        await tx.ocupacao.upsert({
          where: {
            id_ambiente: sensor.id_ambiente,
          },
          update: {},
          create: {
            id_ambiente: sensor.id_ambiente,
            ocupacao_atual: 0,
          },
        });

        let ocupacaoAtualizada;

        if (sensor.tipo === "ENTRADA") {
          // Incremento atômico no banco.
          ocupacaoAtualizada = await tx.ocupacao.update({
            where: {
              id_ambiente: sensor.id_ambiente,
            },
            data: {
              ocupacao_atual: {
                increment: 1,
              },
            },
          });
        } else {
          // Só decrementa quando a ocupação é maior que zero.
          await tx.ocupacao.updateMany({
            where: {
              id_ambiente: sensor.id_ambiente,
              ocupacao_atual: {
                gt: 0,
              },
            },
            data: {
              ocupacao_atual: {
                decrement: 1,
              },
            },
          });

          ocupacaoAtualizada = await tx.ocupacao.findUnique({
            where: {
              id_ambiente: sensor.id_ambiente,
            },
          });
        }

        const novaOcupacao = ocupacaoAtualizada.ocupacao_atual;

        // Verifica se a capacidade máxima foi ultrapassada.
        let alerta = null;

        if (novaOcupacao > sensor.ambiente.max_pessoas) {
          alerta = await tx.logAlerta.create({
            data: {
              id_ambiente: sensor.id_ambiente,
              alerta_seguranca: true,
              mensagem: `Lotação excedida em ${sensor.ambiente.nome}: ${novaOcupacao}/${sensor.ambiente.max_pessoas} pessoas.`,
            },
          });
        }

        return {
          leitura,
          ambiente: sensor.ambiente,
          ocupacao: ocupacaoAtualizada,
          alerta,
        };
      });
    } catch (erro) {
      // Repete a transação em caso de conflito ou deadlock.
      if (erro.code === "P2034" && tentativa < MAX_TENTATIVAS) {
        console.warn(
          `Conflito na transação. Tentativa ${tentativa} de ${MAX_TENTATIVAS}.`
        );

        continue;
      }

      // Outros erros, ou tentativas esgotadas.
      throw erro;
    }
  }
}

export async function listarLeiturasService(idAmbiente) {
  return prisma.leitura.findMany({
    where: idAmbiente
      ? {
          id_ambiente: Number(idAmbiente),
        }
      : undefined,
    orderBy: {
      data_hora: "desc",
    },
    include: {
      sensor: true,
      ambiente: true,
    },
  });
}
