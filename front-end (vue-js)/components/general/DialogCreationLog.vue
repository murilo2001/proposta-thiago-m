<template>
  <v-dialog
    v-model="dialogLocal"
    max-width="450px"
    @click:outside="dialogLocal = false"
    @keydown="dialogLocal = false"
  >
    <v-card>
      <v-card-title class="py-3" style="text-align:left !important">
        <h2>Log de criação</h2>
      </v-card-title>
      <v-divider />
      <v-card-text class="py-3">
        Criado por {{item.username}} em {{item.created | parseToDateTimeBR}}.
      </v-card-text>
      <v-divider />
      <v-card-actions style="text-align:right !important; display: block !important">
        <v-btn
          color="green darken-1"
          @click="dialogLocal = false"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    dialogLocal: {
      get() {
        return this.dialog;
      },
      set(newValue) {
        this.$emit('update:dialog', newValue);
      }
    },
  }
}
</script>