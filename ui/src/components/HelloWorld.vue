<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  },
  assets: {
    type: [String],
    default: []
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://vuejs.org/">Vue 3</a>.
    </h3>
    <div>
      <select v-model="selected">
        <!-- <div v-for="asset of assets"
          :key="asset.id"
        >{{asset.symbol}}</div> -->
        <option v-for="asset of assets"
          :key="asset.id"
          :value=asset
        >{{asset.symbol}}

        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
<script>
export default {
  data() {
    return {
      selected: null
    }
  },
  watch: {
    selected: function (val) {
      this.assetSelected(val);
    }
  },
  methods: {
    assetSelected(value) {
      if (value) {
        this.$emit('assetSelected', value);
      }
    }
  },
  mounted() {}
}
</script>
