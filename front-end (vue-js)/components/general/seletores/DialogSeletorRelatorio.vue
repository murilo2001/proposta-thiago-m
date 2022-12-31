<template>
  <v-dialog 
    v-model="dialog"
    @click:outside="$emit('update:activated', false)"
    max-width="900" 
    scrollable
  >
    <v-card>
      <v-card-title class="headline">Selecionar Relatório:</v-card-title>
      <v-row align="center" no-gutters>
        <v-col cols="12">
          <v-text-field
            v-show="!loading"
            v-model="search"
            append-icon="mdi-magnify"
            class="mx-10 py-4"
            label="Procurar"
            hide-details
            single-line
          />
        </v-col>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="relatorios"
            :items-per-page="itemsPerPage"
            :search.sync="search"
            :page.sync="currentPage"
            :loading="loading"
            :hide-default-header="loading"
            :hide-default-footer="loading"
            no-data-text="Nenhum relatório disponível"
            :mobile-breakpoint="0"
          >
            <template v-slot:item="row">
              <tr @click="selecionarRelatorio(row.item)">
                <td class="button cursor-pointer" style="max-width: 70px"> {{ row.item.id }} </td>
                <td class="button cursor-pointer" style="max-width: 220px">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                    <div class="text-truncate" v-bind="attrs" v-on="on">
                      {{ row.item.nome }}
                    </div>
                    </template>
                    <span>{{ row.item.nome }}</span>
                  </v-tooltip>
                </td>
                <td class="button cursor-pointer" style="max-width: 120px">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                    <div class="text-truncate" v-bind="attrs" v-on="on">
                      {{ row.item.usuario }}
                    </div>
                    </template>
                    <span>{{ row.item.usuario }}</span>
                  </v-tooltip>
                </td>
                <td class="button cursor-pointer">
                  {{ row.item.numero_registros | parseNumberToIntegerBR }}
                </td>
              </tr>
            </template>
            <template v-slot:[`footer.page-text`]>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" v-bind="attrs" v-on="on" @click="getRelatoriosStatusSucesso()">mdi-refresh</v-icon>
                </template>
                <span>Clique aqui para recarregar os relatórios</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import RelatoriosService from '@/services/RelatoriosService';

export default {
  props: {
    activated: {
      type: Boolean,
      required: true
    }
  },

  created() {
    this.getRelatoriosStatusSucesso();
  },

  data: () => ({
    currentPage: 1,
    itemsPerPage: 5,
    search: undefined,
    headers: [
      {
        text: "#",
        value: "id"
      },
      {
        text: "Nome",
        value: "nome"
      },
      {
        text: "Usuário",
        value: "usuario"
      },
      {
        text: "Linhas",
        value: "linhas"
      }
    ],
    relatorios: [],
    loading: false
  }),

  computed: {
    dialog() {
      return this.activated;
    }
  },

  methods: {
    getRelatoriosStatusSucesso() {
      this.loading = true;

      RelatoriosService.getRelatoriosByStatus('sucesso')
      .then(response => {
        this.relatorios = response.data.data;
      })
      .catch(() => this.$toast.error('Erro ao recuperar relatorios com status sucesso.', '',{position:'topRight'}))
      .finally(() => this.loading = false);
    },

    selecionarRelatorio(relatorio) {
      const data = {id: relatorio.id, nome: relatorio.nome};
      this.$emit("selected", data);

      setTimeout(() => { this.search = ""}, 500);
    }
  },

  watch: {
    search() {
      this.currentPage = 1;
    }
  },

  computed: {
    dialog() {
      return this.activated;
    }
  }
}
</script>