<script setup>
import AssetPricePicker from './components/AssetPricePicker.vue'
import AssetPriceViewer from './components/AssetPriceViewer.vue'
</script>

<template>
  <header>
    <img
    v-if="selectedAsset"
    alt="Vue logo"
    style="object-fit: contain"
    class="logo"
    :src="`/src/assets/logos/${selectedAsset.symbol.toLowerCase()}.svg`"
    width="125"
    height="125" />
    <img v-else alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <AssetPricePicker
      msg="Assets"
      :assets=assets
      v-on:assetSelected="assetSelected" />
    </div>
  </header>

  <main>
    <AssetPriceViewer
    :assets=assets
    :selected=selectedAsset />
  </main>
</template>

<style>
@import './assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
<script>
import { get } from 'axios';
export default {
  data() {
    return {
      apiHost: this.API_HOST,
      assets: [],
      selectedAsset: null,
    }
  },
  methods: {
    getCryptoSymbols() {
      get(`http://${this.apiHost}/assets`)
      .then((res) => {
        this.assets = res.data;
      })
    },
    assetSelected(target) {
      this.selectedAsset = target
    }
  },
  mounted() {
    this.getCryptoSymbols();
  }
}
</script>
