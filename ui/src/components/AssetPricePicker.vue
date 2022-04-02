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
      Please select an asset from the list
    </h3>
    <div>
      <select v-model="selected" class='asset-picker'>
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
.asset-picker {
  font-size: 3em;
  border: #eee 1px solid;
  border-radius: 5px;
  box-shadow: 0px 5px 10px -5px #40b883;
  color: #34495e;
  padding: 5px 10px;;
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
    },
    assets: function (val) {
      if (!this.selected && val && val.length) {
        this.selected = val[0];
      }
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
