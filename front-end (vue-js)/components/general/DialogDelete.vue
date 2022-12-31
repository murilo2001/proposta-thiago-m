<template>
  <v-dialog
    v-model="dialogLocal"
    max-width="450px"
    @click:outside="dialogLocal = false"
    @keydown="dialogLocal = false"
  >
    <v-card>
      <v-card-title class="headline-custom">
        <slot name="title" />
      </v-card-title>
      <v-card-text style="font-size: 15px !important">
        <slot name="body" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="green darken-1"
          text
          @click="dialogLocal = false"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="green darken-1"
          @click="$emit('submitTriggered')">
          Deletar
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

<style>
.headline-custom {
  font-size: 1.5em !important;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto" !important;
  font-weight: 500 !important;
}
</style>