import RelatoriosService from "@/services/RelatoriosService.js";
import dayjs from 'dayjs';

export default {
  data: () => ({
    downloadProgressData: {},
  }),

  methods: {
    downloadSpreadSheet(id, nomeRelatorio, tipo = 'xlsx') {
      this.$set(this.downloadProgressData, id, { id });
      this.$toast.info("Preparando seu arquivo para download.", "", {position: "topRight", timeout: 2500});

      RelatoriosService.getRelatorioSpreadSheet(id, tipo, {
        timeout: 60 * 60 * 1000,
        onDownloadProgress: (progressEvent) => {
          let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          let isComputable = progressEvent.lengthComputable;
          this.$set(this.downloadProgressData, id, {
            progress,
            isComputable,
            id,
          });
        },
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        const nomeArquivo = this.getNomeArquivoResultado(nomeRelatorio, tipo);
        
        link.href = url;
        link.setAttribute("download", nomeArquivo);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        this.$toast.error("Erro no download do arquivo.", "", {position: "topRight"});
        console.error(err);
      })
      .finally(() => {
        this.$delete(this.downloadProgressData, id);
      });
    },

    getNomeArquivoResultado(nomeRelatorio, tipo) {
      let dataHoraAtual = dayjs().format('DD-MM-YYYY-HH:mm');
      return nomeRelatorio.toLowerCase() + `_data_${dataHoraAtual}.${tipo}`;
    },
  }
}