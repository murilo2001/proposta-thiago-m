<template>
  <v-dialog
    v-model="dialogLocal"
    max-width="600px"
    @click:outside="dialogLocal = false"
    @keydown="dialogLocal = false"
    :scrollable="scrollable"
  >
    <v-card>
      <v-card-title 
        id="title-dialog-detalhes" 
        class="pt-2" 
        :class="!titleFontSize ? 'headline' : ''"   
        :style="!titleFontSize ? '' : `font-size: ${titleFontSize}; letter-spacing: normal !important`"
      >
        {{title}}
      </v-card-title>
      <v-card-text class="pt-2 px-0 pb-0">
        <slot name="body" />
      </v-card-text>
      <v-divider />
      <v-card-actions class="pt-3 pr-6">
        <v-spacer />
        <v-btn 
          text
          class="text-h2 pa-12"
          @click="dialogLocal = false"
        >
          Fechar
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
    title: {
      type: String,
      required: true,
    },
    titleFontSize: {
      type: String,
      required: false,
    },
    scrollable: {
      type: Boolean,
      default: true
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
  },

  // methods: {
  //   updateValueTextArea(values) {
  //     let updatedValue = [];

  //     values.forEach((value, index) => {
  //       let breakValue = (index == 0 || index == values.length) ? value : '\n'+value;
  //       updatedValue.push(breakValue);
  //     });
  //     return updatedValue;
  //   }
  // }
}
</script>

<style>
.title-dialog-detalhes {
  padding-left: 32px;
  font-size:20.5px !important; 
  text-align: initial; 
  font-weight: bold;
}

@media screen and (max-width: 450px) {
  .title-dialog-detalhes {
    font-size:18px !important; 
  }
}

.style-table-dialog-detalhes table thead tr th {
  font-weight:400;
  font-size:14px;
  height: 33px;
}

.style-table-dialog-detalhes table tbody tr td {
  word-wrap: break-word;
  max-width: 240px;
  font-size: 12.5px;
  padding: 0px 8px !important;
  height: 35px;
}

.style-table-dialog-detalhes table tbody tr td .v-textarea {
  padding-top: 9px !important;
  margin-left: 9px !important;
}

.style-table-dialog-detalhes table tbody tr td .v-textarea textarea{
  font-size: 12.8px;
  color: rgba(0, 0, 0, 0.911);
  font-weight: 300;
}
</style>