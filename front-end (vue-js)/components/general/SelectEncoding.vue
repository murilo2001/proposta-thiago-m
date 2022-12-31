<template>
  <v-select
    v-model="encoding"
    name="encoding"
    :label="label"
    :items="items"
    item-value="encoding"
    item-text="description"
    :outlined="type === 'outlined'"
    class="mb-0 pb-0"
    @change="encodingSelected"
  />
</template>

<script>

export default {
  name: 'SelectEncoding',
  props: {
    type: {
      type: String,
      default: 'solo',
    },  
    label: {
      type: String,
      default: 'Codificação',
    },
    selected: {
      type: String,
      default: 'UTF-8'
    }
  },
  data() {
    return {
      encoding: 'UTF-8',
      items: [
        {
          encoding: 'UTF-8',
          description: 'Unicode (UTF-8)'  
        },
        {
          encoding: 'WINDOWS-1252',
          description: 'ANSI (Windows-1252)'  
        },
        {
          encoding: 'LATIN1',
          description: 'Europeu Ocidental (Latin1)'  
        },
        {
          encoding: 'ISO-8859-1',
          description: 'Europeu Ocidental (ISO-8859-1)'  
        },  
      ]    
    }    
  },
  watch: {
    selected() {
      this.encoding = this.selected;
    }
  },
  mounted() {
    this.encoding = this.selected;
  },
  methods: {
    encodingSelected(event) {
      this.$emit('encoding:selected', event);
    }  
  }   
}

</script>
