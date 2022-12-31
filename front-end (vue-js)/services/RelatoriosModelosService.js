import APIService from './APIService';

export default {
  index() {
    return APIService.apiCall().get('/relatorios-modelos/index');
  },
  getRelatorioModelo(id) {
    return APIService.apiCall().get(`/relatorios-modelos/get-relatorio-modelo/${id}`);
  },
  deletar(id) {
    return APIService.apiCall().get(`/relatorios-modelos/excluir/${id}`);
  },
  save(postData) {
    return APIService.apiCall().post('/relatorios-modelos/save', JSON.stringify(postData));
  }
}