<template>
  <div>
    <v-progress-circular
      v-if="status == 'EXECUTANDO'"
      indeterminate
      color="black"
      size="20"
      width="1"
      class="ml-3"
    />
    <span class="size-status" style="color:green" v-else-if="status == 'SUCESSO'">
      <v-icon small color="green" class="pb-1 icon-status">mdi-check-bold</v-icon>Sucesso
    </span>
    <span class="size-status" style="color:red" v-else-if="status == 'FALHA'">
      <v-icon small color="red" class="pb-1 icon-status">mdi-alert</v-icon>Falha
    </span>
    <span class="size-status" style="color:#3fa6f4" v-else-if="status == 'AGUARDANDO'">
      <v-icon small color="#3fa6f4" class="pb-1 icon-status">mdi-clock-time-four-outline</v-icon>Aguardando
    </span>
    <span class="size-status" style="color:#a672ff" v-else-if="status == 'EM-ANALISE'">
      <v-icon small color="#a672ff" class="pb-1 icon-status">mdi-timer-sand</v-icon>Em An&aacute;lise 
    </span>
    <span class="size-status" style="color:gray" v-else-if="status == 'EXPIRADO'">
      <v-icon small color="gray" class="pb-1 icon-status">mdi-timer-off-outline</v-icon>Expirado
    </span>
    <span class="size-status" style="color:gray" v-else>
      {{treatedStatus}}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    },
  },

  computed: {
    treatedStatus() {
      return this.status.charAt(0).toUpperCase() + this.status.slice(1).toLowerCase();
    }
  }
}
</script>

<style>
  .size-status {
    font-size: 0.95rem !important;
    font-weight: normal !important;
  }

  .size-status .v-icon {
    font-size: 0.9rem !important;
  }

  .icon-status{
    margin-right: 1.7px !important;
  }
</style>