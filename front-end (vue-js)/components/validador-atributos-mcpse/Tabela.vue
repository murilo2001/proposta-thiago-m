<template>
  <v-container class="pt-0">
    <base-material-card
      color="primary"
      icon="mdi-file-settings"
      inline
      class="px-5 py-4 ml-0"
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Validador de Atributos MCPSE
        </div>
      </template>
      <v-btn
        color="primary"
        dark
        elevation="1"
        class="mt-5"
        style="float:left"
        relative
        text
        medium
        @click="$router.replace('edit')"
      >
        <v-icon left size="30px">
          mdi-plus-circle
        </v-icon>
        Nova Validação
      </v-btn>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto mt-4 break-search"
        label="Procurar"
        hide-details
        single-line
        style="max-width: 250px"
      />
      <general-progress-bars
        class="mt-11"
        :items="downloadProgressData"
        prefixText="Baixando Validação de Atributos MCPSE"
      />
      <v-divider class="mt-10" />
      <v-data-table
        :headers="headers"
        :items="items"
        :search.sync="search"
        :mobile-breakpoint="800"
        :loading="loading"
        :hide-default-header="loading"
        :hide-default-footer="loading"
        no-data-text="Nenhuma validação disponível"
      >
        <template v-slot:[`item.id`]="{ item }">
          {{ item.id }}
        </template>
        <template v-slot:[`item.nome`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                class="text-truncate-column"
                v-bind="attrs"
                v-on="on"
              >
                {{ item.nome }}
              </div>
            </template>
            <span>{{ item.nome }}</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.base`]="{ item }">
          {{ item.base }}
        </template>
        <template v-slot:[`item.data_processamento`]="{ item }">
          {{ item.data_processamento | parseToDateTimeBR }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <general-status :status="item.status" />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            :class="item.status != 'SUCESSO' ? 'cursor-block' : ''"
            class="px-1"
            min-width="0"
            fab
            icon
            x-small
            @click="downloadItem(item)"
            :loading="(downloadProgressData[item.id] !== undefined) ? true : false"
            :disabled="item.status != 'SUCESSO'"
          >
            <v-icon small>
              mdi-download
            </v-icon>
          </v-btn>
          <v-btn
            color="gray"
            min-width="0"
            class="px-1 ml-n1"
            fab
            icon
            x-small
            @click="$router.replace(`edit/${item.id}`)"
          >
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="white"
                class="ml-1"
                height="22px"
                width="22px"
                fab
                x-small
                elevation="1"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small>
                  mdi mdi-dots-vertical
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-if="canRunItem(item)"
                @click="executarItem(item.id)"
              >
                <v-list-item-title>
                  <v-icon small>
                    mdi-play
                  </v-icon>
                  Executar
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="openDialogDetalhes(item)"
              >
                <v-list-item-title>
                  <v-icon small>
                    mdi-file-find-outline
                  </v-icon>
                  Detalhes
                </v-list-item-title>
              </v-list-item>
              <v-list-item 
                @click="dialogCreationLog = true, dialogCreationLogData = {username: item.usuario, created: item.created}"
              >
                <v-list-item-title>
                  <v-icon small>
                    mdi-table-search
                  </v-icon>
                  Log
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="canDeleteItem(item)"
                @click="openDialogDelete(item.id, item.titulo)"
              >
                <v-list-item-title>
                  <v-icon small>
                    mdi-trash-can-outline
                  </v-icon>
                  Deletar
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </base-material-card>
    <dialog-creation-log
      :dialog.sync="dialogCreationLog"
      :item="dialogCreationLogData"
    />
    <dialog-delete 
      :dialog.sync="dialogDelete"
      @submitTriggered="deletarItem(dialogDeleteData.id)"
    >
      <template slot="title">Deletar Validação #{{ dialogDeleteData.id }}</template>
      <template slot="body">Tem certeza que deseja deletar a validação de atributos mcpse <strong>{{ dialogDeleteData.titulo }}</strong>?</template>
    </dialog-delete>
    <dialog-detalhes
      title="Detalhes da Validação"
      :dialog.sync="dialogDetalhes"
    >
      <template slot="body">
        <v-data-table
          :headers="dialogDetalhesHeader"
          :items="dialogDetalhesData"
          :mobile-breakpoint="0"
          hide-default-footer
          class="elevation-1 style-table-dialog-detalhes"
          disable-pagination
        >
          <template v-slot:[`item.valor`]="{ item }">
            <v-tooltip
              v-if="typeof item.valor === 'object' && 'referencia' in item.valor"
              bottom
            >
              <template v-slot:activator="{ on, attrs }">
                <a
                  v-bind="attrs"
                  v-on="on"
                  href="javascript:void(0)"
                  @click="baixarArquivo(item.valor.id, item.valor.tipo)"
                >
                  {{item.valor.referencia}}
                </a>
                <v-progress-circular
                  v-show="loadingArquivoReferencia"
                  class="ml-2"
                  indeterminate
                  color="primary"
                  size="20"
                />
              </template>
              <span v-if="loadingArquivoReferencia">Baixando...</span>
              <span v-else-if="item.valor.tipo == 'relatorio'">Clique aqui para baixar o arquivo do relatório utilizado na validação</span>
              <span v-else>Clique aqui para baixar o utilizado na validação</span>
            </v-tooltip>
            <v-tooltip
              v-else-if="typeof item.valor === 'object' && 'logs_tecnicos' in item.valor"
              bottom
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ml-btn-logs-mcpse"
                  icon
                  color="black"
                  @click="baixarLogsTecnicos(item.valor.id)"
                  :loading="loadingLogsTecnicos"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="18">
                    mdi-file-download-outline
                  </v-icon>
                </v-btn>
              </template>
              <span v-if="loadingLogsTecnicos">Baixando...</span>
              <span v-else>Clique aqui para baixar os logs técnicos</span>
            </v-tooltip>
            <span v-else>{{item.valor}}</span>
          </template>
        </v-data-table>
      </template>
    </dialog-detalhes>
  </v-container>
</template>

<script>
import ValidadorAtributosMCPSEService from '@/services/ValidadorAtributosMCPSEService';
import powerupsActionsMixins from '@/mixins/powerupsActionsMixins';

export default {
  mixins: [powerupsActionsMixins],

  components: {
    GeneralStatus: () => import("@/components/general/GeneralStatus.vue"),
    GeneralProgressBars: () => import("@/components/general/GeneralProgressBars.vue"),
    DialogCreationLog: () => import('@/components/general/DialogCreationLog'),
    DialogDelete: () => import('@/components/general/DialogDelete'),
    DialogDetalhes: () => import('@/components/general/DialogDetalhes')
  },

  props: {
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      required: true
    }
  },

  data: () => ({
    powerupService: ValidadorAtributosMCPSEService,
    powerupEntityName: "Validação de Atributos MCPSE",
    search: "",
    headers: [
      {
        text: '#',
        value: 'id'
      },
      {
        text: 'Nome',
        value: 'titulo'
      },
      {
        text: 'Base',
        value: 'tipo'
      },
      {
        text: 'Executado',
        value: 'data_processamento'
      },
      {
        text: 'Status',
        value: 'status'
      },
      {
        sortable: false,
        text: 'Ações',
        value: 'actions',
        class: 'pl-4'
      }
    ],
    dialogDetalhesHeader: [
      {text: 'Parâmetro', value: 'parametro', sortable: false},
      {text: 'Valor', value: 'valor', sortable: false}
    ],
    loadingArquivoReferencia: false,
    loadingLogsTecnicos: false
  }),

  methods: {
    openDialogDetalhes(item) {
      this.dialogDetalhesData = [
        {
          parametro: 'ORIGEM:',
          valor: item.origem == 'RELATORIO' ? 'RELATÓRIO' : 'ARQUIVO',
        }
      ];

      if (item.origem == 'RELATORIO') {

        this.dialogDetalhesData.push(
          {
            parametro: 'RELATORIO REFERÊNCIA:',
            valor: {'id': item.id, 'referencia' : item.relatorio_nome, 'tipo': 'relatorio'}
          }
        );

      } else {

        this.dialogDetalhesData.push(
          {
            parametro: 'ARQUIVO REFERÊNCIA:',
            valor: {'id': item.id, 'referencia' : item.arquivo_nome, 'tipo': 'arquivo'}
          },
          {
            parametro: 'CODIFICAÇÃO:',
            valor: item.encoding
          },
          {
            parametro: 'DELIMITADOR:',
            valor: item.arquivo_delimitador
          },
          {
            parametro: 'INVÓLUCRO:',
            valor: item.arquivo_involucro
          },
          {
            parametro: 'ESCAPE:',
            valor: item.arquivo_escape
          }
        );
      }

      if (['SUCESSO', 'FALHA', 'DATA_BASE'].includes(item.status)) {
        this.dialogDetalhesData.push(
          {
            parametro: ' ',
            valor: ' '
          },
          {
            parametro: 'LOGS TÉCNICOS:',
            valor: {'id': item.id, 'logs_tecnicos': true}
          }
        );
      }

      this.dialogDetalhes = true;
    },

    baixarArquivo(idValidacao, tipo) {
      if (this.loadingArquivoReferencia) return;

      this.loadingArquivoReferencia = true;

      ValidadorAtributosMCPSEService
        .baixarArquivoReferencia(idValidacao)
        .then(res => {

          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          const nome = tipo == 'relatorio' ? 'relatorio_referencia.csv' : 'arquivo_referencia.csv';
          link.href = url;
          link.setAttribute('download', nome);
          document.body.appendChild(link);
          link.click();
        })
        .catch(() => {
          this.$toast.error('Falha no download do arquivo referência.', '', { position: 'topRight' });
        })
        .finally(() => this.loadingArquivoReferencia = false);
    },

    baixarLogsTecnicos(idValidacao) {
      this.loadingLogsTecnicos = true;

      ValidadorAtributosMCPSEService
        .baixarLogsTecnicos(idValidacao)
        .then(res => {

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `logs-tecnicos-validacao-atributos-mcpse-${idValidacao}.log`);
            document.body.appendChild(link);
            link.click();
        })
        .catch(() => {
            this.$toast.error('Falha no download dos logs técnicos.', '', { position: 'topRight' });
        })
        .finally(() => this.loadingLogsTecnicos = false);
    },
  }
}
</script>

<style scoped>
.ml-btn-logs-mcpse {
  margin-left: -15px !important;
}
</style>