import type { Request, Response } from "express";

import {
  registrarLeitura,
  listarLeituras,
} from "../models/leitura.model.js";

export async function criarLeitura(req: Request, res: Response) {
  try {
    const sensorId = req.body.sensorId ?? req.body.id_sensor;
    const tipoRecebido = req.body.tipo;

    if (!sensorId) {
      return res.status(400).json({
        erro: "O campo sensorId é obrigatório.",
      });
    }

    const resultado = await registrarLeitura({
      sensorId: Number(sensorId),
      tipoRecebido,
    });

    return res.status(201).json({
      mensagem: "Leitura registrada com sucesso.",
      dados: {
        tipo: resultado.leitura.tipo,
        data_hora: resultado.leitura.data_hora,
        ambiente: resultado.ambiente.nome,
        ocupacao_atual: resultado.ocupacao.ocupacao_atual,
        max_pessoas: resultado.ambiente.max_pessoas,
        alerta: resultado.alerta,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "SENSOR_NAO_ENCONTRADO") {
        return res.status(404).json({
          erro: "Sensor não encontrado.",
        });
      }

      if (error.message === "TIPO_SENSOR_INVALIDO") {
        return res.status(400).json({
          erro: "O tipo enviado não corresponde ao tipo cadastrado para esse sensor.",
        });
      }
    }

    return res.status(500).json({
      erro: "Erro interno ao registrar leitura.",
    });
  }
}

export async function listarLeiturasController(req: Request, res: Response) {
  try {
    const leituras = await listarLeituras();

    return res.json({
      dados: leituras,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao listar leituras.",
    });
  }
}

export { criarLeitura as registrarLeitura };
export { listarLeiturasController as listarLeituras };