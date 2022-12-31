<template>
  <v-container>
    <template v-if="renderizacaoLiberada">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-row justify="center">
          <v-col cols="12">
            <parametros ref="parametrosREF" :item="item" />
          </v-col>
          <v-col cols="12">
            <v-btn
              color="green"
              min-width="100"
              style="float: right"
              :disabled="invalid"
              :loading="loading"
              @click="salvar()"
            >
              Salvar
            </v-btn>
          </v-col>
        </v-row>
      </validation-observer>
    </template>
    <template v-else>
      <v-container fluid fill-height>
        <v-row align="center" class="mx-auto" style="height: 400px !important">
          <v-col cols="12" align="center" jusitfy="center">
            <v-progress-circular
              indeterminate
              color="primary"
              :size="100"
            />
          </v-col>
      </v-row>
      </v-container>
    </template>
  </v-container>
</template>

<script>
import ValidadorAtributosMCPSEService from '@/services/ValidadorAtributosMCPSEService';

export default {
  components: {
    Parametros: () => import('@/components/validador-atributos-mcpse/Parametros.vue')
  },

  created() {
    if (this.$route.params.id) this.getValidacaoMCPSE(this.$route.params.id);
  },

  data: () => ({
    item: {},
    loading: false
  }),

  computed: {
    renderizacaoLiberada() {
      if (!this.$route.params.id) return true;

      return this.$route.params.id && JSON.stringify(this.item) !== '{}' ? true : false;
    },
  },

  methods: {
    getValidacaoMCPSE(id) {
      ValidadorAtributosMCPSEService.getValidacao(id).then(response => {
        this.item = response.data.data;
      })
      .catch(() => {
        this.$toast.error('Erro ao recuperar validação.', '',{position:'topRight'});
      });
    },

    salvar() {
      this.loading = true;

      const data = this.$refs.parametrosREF.exportData();

      ValidadorAtributosMCPSEService.salvar(data)
        .then(() => {
          this.$toast.success('Validação salva com sucesso.', '',{position:'topRight'});
          this.$router.push({ name: "Validador de Atributos MCPSE Histórico" });
        })
        .catch(() => this.$toast.error('Erro ao salvar validação.', '',{position:'topRight'}))
        .finally(() => this.loading = false);
    }
  }
}
</script>