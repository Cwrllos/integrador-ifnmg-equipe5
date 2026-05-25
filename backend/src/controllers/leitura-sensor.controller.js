import {
    salvarLeituraSensor,
    listarLeituraSensor,
    buscarUltimaLeituraSensor

} from '../models/leitura-sensor.model.js';

export async function receberLeituraSensor(requisicao, resposta){
    try{
        const dadosSensor = requisicao.body;

        console.log('Dados recebidos no backend:', dadosSensor);

        // validação dos dados

        const leituraSalva = await salvarLeituraSensor(dadosSensor);

        return resposta.status(201).json({
            mensagem: 'Leitura salva com sucesso',
            dados: leituraSalva
        });

    }

    catch(erro){
        console.error('Erro ao salvar a leitura no banco de dados:', erro.message);

        return resposta.status(500).json({
            mensagem: 'Erro interno ao salvar a leitura no banco de dados'
        });
    }
}

export async function buscarLeituraSensor(requisicao, resposta){
    try{
        const leituras = await listarLeituraSensor();

        return resposta.status(200).json({
            mensagem: 'Leituras listadas com sucesso',
            total: leituras.length,
            dados: leituras
        });
    }

    catch(erro){
        console.error('Erro ao listar os dados:', erro.message);

        return resposta.status(500).json({
            mensagem: 'Erro interno ao listar as leituras do banco de dados'
        });
    }
}

export async function buscarUltimaLeitura(requisicao, resposta){
    try{
        const ultimaleitura = await
        buscarUltimaLeituraSensor();

        return resposta.status(200).json({
            mensagem:  "Última leitura consultada com sucesso",
            dado: ultimaleitura
        });

    } catch(erro){
        console.error('Erro ao buscar a última leitura: ', erro.message);

        return respota.status(500).json({
            mensagem: 'Erro interno ao buscar a última leitura no banco de dados'
        });
    }
}
