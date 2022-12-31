import APIService from './APIService';

export default {
  getAllValidacoes() {
    return APIService.apiCall().get('/validador-atributos-mcpse/get-all-validacoes');
  },
  getValidacao(id) {
    return APIService.apiCall().get(`/validador-atributos-mcpse/get-validacao/${id}`);
  },
  salvar(postData) {
    return APIService.apiCall().post('/validador-atributos-mcpse/salvar', JSON.stringify(postData));
  },
  deletar(id) {
    return APIService.apiCall().get(`/validador-atributos-mcpse/excluir/${id}`);
  },
  executar(id) {
    return APIService.apiCall().get(`/validador-atributos-mcpse/executar/${id}`);
  },
  download(id, config = {}) {
    return APIService.apiCall().get(`/validador-atributos-mcpse/baixar-arquivo-resultado/${id}`, { responseType: 'blob', ...config });
  },
  baixarArquivoReferencia(idValidacao) {
    return APIService.apiCall().get(`validador-atributos-mcpse/download-arquivo-referencia/${idValidacao}`, {
      responseType: 'blob', ... {
        timeout: 60 * 60 * 1000
      }
    });
  },
  baixarLogsTecnicos(id) {
    return APIService.apiCall().get(`validador-atributos-mcpse/logs-tecnicos/${id}`, {
      responseType: 'blob', ... {
        timeout: 60 * 60 * 1000
      }
    });
  }
}