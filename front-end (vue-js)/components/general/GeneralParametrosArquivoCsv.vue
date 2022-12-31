<template>
  <v-row align="center" class="mx-auto">
    <v-col cols="12" sm="4">
      <validation-provider v-slot="{ errors }" rules="required|max:1">
        <v-text-field label="Delimitador" outlined v-model="campoDelimitador" :error-messages="errors" maxlength="1"/>
      </validation-provider>
    </v-col>
    <v-col cols="12" sm="4">
      <validation-provider v-slot="{ errors }" rules="required|max:1">
        <v-text-field label="Invólucro" outlined v-model="campoInvolucro" :error-messages="errors" maxlength="1"/>
      </validation-provider>
    </v-col>
    <v-col cols="12" sm="4">
      <validation-provider v-slot="{ errors }" rules="required|max:1">
        <v-text-field label="Escape" outlined v-model="campoEscape" :error-messages="errors" maxlength="1"/>
      </validation-provider>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    delimitador: {
      type: String,
      required: true
    },
    involucro: {
      type: String,
      required: true
    },
    escape: {
      type: String,
      required: true
    }
  },

  computed: {
    campoDelimitador: {
      get() {
        return this.delimitador;
      },
      set(newValue) {
        this.$emit('update:delimitador', newValue);
      }
    },
    campoInvolucro: {
      get() {
        return this.involucro;
      },
      set(newValue) {
        this.$emit('update:involucro', newValue);
      }
    },
    campoEscape: {
      get() {
        return this.escape;
      },
      set(newValue) {
        this.$emit('update:escape', newValue);
      }
    },
  }
}
</script>