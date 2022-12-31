import AuthService from '@/services/AuthService';

export default {
  data: () => ({
    powerupService: null, // Mudar essa variavel no componente
    powerupEntityName: "Item", // Mudar essa variavel no componente
    downloadProgressData: {},
    dialogDeleteData: {},
    dialogDelete: false,
    dialogCreationLog: false,
    dialogCreationLogData: {},
    dialogDetalhesData: {},
    dialogDetalhesHeader: [],
    dialogDetalhes: false,
    userIsAdmin: false,
    usuarioId: undefined
  }),

  created() {
    this.getUserInfo();
  },

  methods: {
    /**
     * @param {String|Number} itemId Id da entidade
     * @param {String} itemTitle Nome/Titulo da entidade
     */
    openDialogDelete(itemId, itemTitle) {
      this.dialogDeleteData = { id: itemId, titulo: itemTitle };
      this.dialogDelete = true;
    },

    openDialogDetalhes(item) {
      this.dialogDetalhesData = item;
      this.dialogDetalhes = true;
    },

    /**
     * @param {String|Number} itemId Id da entidade
     */
    deletarItem(itemId) {
      this.powerupService.deletar(itemId)
      .then(() => {
        this.$toast.success(`${this.powerupEntityName} removido(a) com sucesso.`, '', {position:'topRight'});
        this.$emit('rechargeTable');
      })
      .catch(() => {
        this.$toast.error(`Erro ao deletar ${this.powerupEntityName}.`, '', { position: 'topRight' });
      })
      .finally(() => this.dialogDelete = false);
    },

    /**
     * @param {String|Number} itemId Id da entidade
     */
     duplicarItem(itemId) {
      this.powerupService.duplicar(itemId)
        .then(() => {
          this.$toast.success(`${this.powerupEntityName} duplicado(a) com sucesso.`, '', {position:'topRight'});
          this.$emit('rechargeTable');
        })
        .catch(() => this.$toast.error(`Erro ao duplicar ${this.powerupEntityName}.`, "", { position: "topRight" }));
    },

    /***
     * @param {String|Number} itemId Id da entidade
     */
     executarItem(itemId) {
      this.powerupService.executar(itemId)
        .then(() => {
          this.$toast.info("O processamento ocorrerá em instantes. Por favor, aguarde.", "", { position: "topRight", timeout: 2000 });
          this.$emit('rechargeTable');
        })
        .catch(() => {
          this.$toast.error(`Erro ao executar ${this.powerupEntityName}.`, "", { position: "topRight" });
        });
    },

    downloadItem(item, tituloArquivo = "") {
      const id = item.id;
      const nomeCompletoArquivo = (tituloArquivo) ? `${tituloArquivo}.xlsx` : `Resultado ${this.powerupEntityName} ${id}.xlsx`;
      
      this.$set(this.downloadProgressData, id, { id }); 
      this.$toast.info("Preparando seu arquivo para download.", '', {position:'topRight', timeout: 2000});

      this.powerupService.download(id, {
        timeout: 60 * 60 * 1000,
        onDownloadProgress: (progressEvent) => {
          let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          let isComputable = progressEvent.lengthComputable;

          this.$set(this.downloadProgressData, id, { progress, isComputable, id });
        }
      })
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", nomeCompletoArquivo);
          document.body.appendChild(link);
          link.click();
        })
        .catch(err => {
          this.$toast.error("Falha no download do resultado.", "", { position: "topRight" });
          console.error("Error: ", err);
        })
        .finally(() => {
          this.$delete(this.downloadProgressData, id);
        });
    },

    canDeleteItem(item) {
      return item.status !== 'EXECUTANDO' && (this.userIsAdmin || this.usuarioId === item.usuario_id);
    },

    canRunItem(item) {
      return item.status !== 'EXECUTANDO' && item.status !== 'AGUARDANDO' && (this.userIsAdmin || this.usuarioId === item.usuario_id);
    },

    canEditItem(item) {
      return item.status !== 'EXECUTANDO' && (this.userIsAdmin || this.usuarioId === item.usuario_id);
    },

    async getUserInfo() {
      this.usuarioId = this.$store.getters.getUserId;
      this.userIsAdmin = await AuthService.userIsAdmin();
    }
  },
}