<template>
  <v-alert
    v-if="Object.keys(items).length > 0"
    dense
    border="left"
    colored-border
    elevation="1"
    color="primary"
    class="mt-0 mb-0 py-1 px-1"
  >
    <v-fade-transition group>
      <v-row
        no-gutters
        align="center"
        justify="space-around"
        class="my-0 mx-4"
        v-for="(item, _key) in items" :key="_key"
      >
        <v-col v-if="truncateText" cols="12" xl="2" lg="3" md="4" sm="6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                class="text-truncate-column"
                v-bind="attrs" v-on="on"
              >
                <span>{{ prefixText }} {{ includeHashOnText ? '#' : '' }}{{ item[suffixProperty] }}</span>
              </div>
            </template>
            <span>{{ prefixText }} {{ includeHashOnText ? '#' : '' }}{{ item[suffixProperty] }}</span>
          </v-tooltip>
        </v-col>
        <v-col v-else cols="auto">
          <span>{{ prefixText }} {{ includeHashOnText ? '#' : '' }}{{ item[suffixProperty] }}</span>
        </v-col>
        
        <v-col cols="12" xl="10" lg="9" md="8" sm="6">
          <v-progress-linear
            :indeterminate="!item.isComputable"
            :value="item.progress"
            rounded
            :height="progressBarHeight"
          />
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-alert>
</template>

<script>
export default {
  name: "GeneralProgressBars",
  props: {
    prefixText: {
      type: String,
      default: ""
    },
    items: {
      type: Object,
      required: true,
      default: () => {}
    },
    progressBarHeight: {
      type: String,
      default: "1"
    },
    suffixProperty: {
      type: String,
      default: "id"
    },
    includeHashOnText: {
      type: Boolean,
      default: true
    },
    truncateText: {
      type: Boolean,
      default: false
    }
  },
};
</script>
