<template>
  <base-material-card
    color="primary"
    icon="mdi-format-list-checks"
    inline
    class="px-5 py-5"
  >
    <template v-slot:after-heading>
      <div class="display-1 font-weight-light">
        Adicionar Validação de Atributos MCPSE
      </div>
    </template>

    <v-form class="pt-5">
      <v-row align="center" class="mx-auto">
        <v-col cols="12" class="py-0">
          <validation-provider v-slot="{ errors }" rules="required">
            <v-text-field
              v-model="titulo"
              label="Título"
              outlined
              :error-messages="errors"
            />
          </validation-provider>
        </v-col>
      </v-row>
      <v-row align="center" class="mx-auto">
        <v-col cols="6" class="py-0">
          <validation-provider v-slot="{ errors }" rules="required">
            <v-select
              v-model="tipo"
              :items="bases"
              label="Tipo"
              no-gutters
              outlined
              :error-messages="errors"
            />
          </validation-provider>
        </v-col>
        <v-col cols="6" class="py-0">
          <validation-provider v-slot="{ errors }" rules="required">
            <v-select
              v-model="origem"
              :items="origens"
              label="Origem"
              no-gutters
              outlined
              :error-messages="errors"
              :disabled="!tipo"
              :readonly="!tipo"
              :persistent-hint="!tipo"
              :hint="!tipo ? 'Antes de selecionar a origem defina o tipo da base' : ''"
            />
          </validation-provider>
        </v-col>
      </v-row>
      <v-row align="center" class="mx-auto">
        <v-col cols="12" v-show="origem && tipo" class="py-0">
          <v-alert dense outlined type="info" color="blue">
            <div v-if="tipo == 'BASE FÍSICA' && origem != 'ARQUIVO'">
              O relatório selecionado deve conter os campos <b>TI, TUC, A1, A2, A3, A4, A5, A6</b> e opcionalmente <b>CM</b>.
              <br>Obs: A coluna <b>CM</b> pode conter o nome de <b>CM</b> ou <b>AIS_CM</b> para ser validado.
            </div>
            <!-- A validação para o campo QTD só faz sentido na base contábil -->
            <div v-else-if="tipo == 'BASE CONTÁBIL' && origem != 'ARQUIVO'">
              O relatório selecionado deve conter os campos <b>TI, TUC, A1, A2, A3, A4, A5, A6</b> e opcionalmente <b>QTD</b> e <b>CM</b>.
              <br>Obs²: A coluna <b>QTD</b> pode conter o nome de <b>QTD</b> ou <b>QTD :: SOMATORIO</b> para ser validado.
              <br>Obs: A coluna <b>CM</b> pode conter o nome de <b>CM</b> ou <b>AIS_CM</b> para ser validado.
            </div>

            <div v-if="tipo == 'BASE FÍSICA' && origem == 'ARQUIVO'">
              O arquivo selecionado deve conter os campos <b>TI, TUC, A1, A2, A3, A4, A5, A6</b> e opcionalmente <b>CM</b>.
              <br>Obs: A coluna <b>CM</b> pode conter o nome de <b>CM</b> ou <b>AIS_CM</b> para ser validado.
            </div>
            <!-- A validação para o campo QTD só faz sentido na base contábil -->
            <div v-else-if="tipo == 'BASE CONTÁBIL' && origem == 'ARQUIVO'">
              O arquivo selecionado deve conter os campos <b>TI, TUC, A1, A2, A3, A4, A5, A6</b> e opcionalmente <b>QTD</b> e <b>CM</b>.
              <br>Obs²: A coluna <b>QTD</b> pode conter o nome de <b>QTD</b> ou <b>QTD :: SOMATORIO</b> para ser validado.
              <br>Obs: A coluna <b>CM</b> pode conter o nome de <b>CM</b> ou <b>AIS_CM</b> para ser validado.
            </div>
          </v-alert>
        </v-col>
      </v-row>
      <v-row align="center" class="mx-auto" v-if="origem == 'RELATORIO'">
        <v-col cols="12" class="py-0">
          <validation-provider v-slot="{ errors }" rules="required">
            <v-text-field
              label="Relatório"
              placeholder="Selecione um relatório"
              outlined
              readonly
              :value="relatorioNome"
              :error-messages="errors"
              @focus.close="dialogRelatorio = true"
            />
          </validation-provider>
        </v-col>
      </v-row>
      <div v-if="origem == 'ARQUIVO'">
        <v-row align="center" class="mx-auto">
          <v-col md="6" sm="6" cols="12" class="py-0">
            <validation-provider v-slot="{ errors }" rules="required">
              <v-file-input
                v-model="arquivo"
                class="ml-n2"
                style="min-width: calc(100% + 8px) !important"
                label="Arquivo CSV"
                placeholder="Selecione um arquivo CSV"
                accept=".csv, .zip"
                loader-height="4"
                truncate-length="30"
                outlined
                :show-size="!fakeFile"
                :loading="loadingUploading"
                :success="arquivoId && arquivo ? true : false"
                :error-messages="errors"
                @change="uploadNewFile(arquivo)"
              />
            </validation-provider>

            <!-- Validar se o upload do arquivo foi concluido -->
            <validation-provider rules="required">
              <input type="hidden" name="validateUpload" :value="arquivoId" />
            </validation-provider>
          </v-col>
          <v-col md="6" sm="6" cols="12" class="py-0">
            <select-encoding
              label="Codificação do arquivo"
              type="outlined"
              :selected="encoding"
              @encoding:selected="($event) => this.encoding = $event"
            />
          </v-col>
        </v-row>
        <parametros-arquivo-csv
          class="mt-n2"
          :delimitador.sync="delimitador"
          :involucro.sync="involucro"
          :escape.sync="escape"
        />
      </div>
    </v-form>
    <dialog-seletor-relatorio :activated.sync="dialogRelatorio" @selected="setRelatorio($event)" />
  </base-material-card>
</template>

<script>
import FilesService from "@/services/FilesService.js";

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },

  components: { 
    DialogSeletorRelatorio: () => import("@/components/general/seletores/DialogSeletorRelatorio.vue"),
    ParametrosArquivoCsv: () => import("@/components/general/GeneralParametrosArquivoCsv.vue"),
    SelectEncoding: () => import('@/components/general/SelectEncoding.vue')
  },

  created() {
    if (this.$route.params.id) this.fillFields();
  },

  data: () => ({
    titulo: null,
    tipo: null,
    bases: ["BASE FÍSICA", "BASE CONTÁBIL"],
    origem: null,
    origens: ["RELATORIO", "ARQUIVO"],
    dialogRelatorio: false,
    relatorioId: null,
    relatorioNome: null,
    arquivo: undefined,
    arquivoId: null,
    delimitador: ";",
    escape: `"`,
    involucro: `"`,
    fakeFile: false,
    loadingUploading: false,
    encoding: 'UTF-8',
  }),

  methods: {
    fillFields() {
      this.titulo = this.item.titulo;
      this.tipo = this.item.tipo == 'BASE CONTABIL' ? 'BASE CONTÁBIL' : 'BASE FÍSICA';
      this.origem = this.item.origem;
      this.fakeFile = this.item.origem  == 'ARQUIVO' ? true : false;
      this.arquivoId = this.item.origem == 'ARQUIVO' ? this.item.arquivo_id : null;
      this.arquivo = this.item.origem == 'ARQUIVO' ? this.getFakeFileForValidation(this.item.arquivo_nome) : undefined;
      this.encoding = this.item.encoding;
      this.delimitador = this.item.arquivo_delimitador;
      this.escape = this.item.arquivo_escape;
      this.involucro = this.item.arquivo_involucro;
      this.relatorioId = this.item.origem == 'RELATORIO' ? this.item.relatorio_id : null;
      this.relatorioNome = this.item.origem == 'RELATORIO' ? this.item.relatorio_nome : null;
    },

    getFakeFileForValidation(nomeArquivo) {
      return new File([""], nomeArquivo, { type: "text/csv" });
    },

    setRelatorio(event) {
      this.relatorioId = event.id;
      this.relatorioNome = `#${event.id} - ${event.nome}`;
      this.dialogRelatorio = false;
    },

    uploadNewFile(arquivo) {
      if (!arquivo) return;

      this.fakeFile = false;
      this.arquivoId = "";
      this.loadingUploading = true;
      
      let formDataWithFile = new FormData();
      formDataWithFile.append("arquivo", arquivo);

      FilesService.upload(formDataWithFile, {})
        .then(response => {
          const arquivo = response.data.arquivos[0];
          this.arquivoId = arquivo.id;
        })
        .catch(() => {
          this.$toast.error("Erro no upload do arquivo.", "", { position: "topRight" });
          this.arquivo = undefined;
        })
        .finally(() => this.loadingUploading = false);
    },

    exportData() {
      return {
        id: this.$route.params.id ? this.$route.params.id : null,
        titulo: this.titulo,
        tipo: this.tipo === "BASE FÍSICA" ? "BASE FISICA" : "BASE CONTABIL",
        origem: this.origem,
        relatorio_id: this.origem === "RELATORIO" ? this.relatorioId : null,
        arquivo_id: this.origem === "ARQUIVO" ? this.arquivoId : null,
        encoding: this.encoding,
        arquivo_delimitador: this.delimitador,
        arquivo_involucro: this.involucro,
        arquivo_escape: this.escape
      };
    }
  },

  watch: {
    origem() {
      if (this.$route.params.id) return;

      this.dialogRelatorio = false;
      this.relatorioId = null;
      this.relatorioNome = null;
      this.arquivo = undefined;
      this.arquivoId = "";
      this.delimitador = ";";
      this.involucro = `"`;
      this.escape = `"`;
      this.fakeFile = false;
      this.encoding = 'UTF-8';
    
      this.$forceUpdate();
    },

    item() {
      this.fillFields();
    }
  }
}
</script>