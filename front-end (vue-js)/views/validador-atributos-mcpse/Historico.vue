<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="pb-0">
        <tabela
          :loading="loading"
          :items="items"
          @rechargeTable="getAll()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ValidadorAtributosMCPSEService from '@/services/ValidadorAtributosMCPSEService';
import refreshDataMixins from '@/mixins/refreshDataMixins';
// import tourMixins from '@/mixins/tourMixins';

export default {
  mixins: [refreshDataMixins],

  components: {
    Tabela: () => import('@/components/validador-atributos-mcpse/Tabela')
  },

  data: () => ({
    items: [],
    loading: false
  }),

  created() {
    this.refreshData(this.getAll);
  },

  methods: {
    getAll() {
      this.items = [];
      this.loading = true;

      ValidadorAtributosMCPSEService.getAllValidacoes().then((response) => {
        this.items = response.data.data;
        // this.iniciarTourPagina();
      })
      .finally(() => this.loading = false);
    }
  }
}
</script>