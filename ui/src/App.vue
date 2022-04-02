<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld
      msg="Assets"
      :assets=assets
      v-on:assetSelected="assetSelected" />
    </div>
  </header>

  <main>
    <TheWelcome
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
      apiHost: 'api.amanze.local',
      assets: [],
      selectedAsset: null,
    }
  },
  methods: {
    getCryptoSymbols() {
      // fetch({
      //   method: 'GET',
      //   url: '${apiHost}/assets'
      // })
      get(`http://${this.apiHost}/assets`)
      .then((res) => {
        // console.log('###################', { res });
        this.assets = res.data;
      })
    },
    assetSelected(target) {
      console.log('###################', { target });
      this.selectedAsset = target
    }
  },
  mounted() {
    console.log(`The initial count is ${this.count}.`)
    const socket = new WebSocket(`ws://${this.apiHost}/ws`);
    socket.onmessage = ({data}) => {
      console.log('Message from server', data.toString());
    }
    this.getCryptoSymbols();
  }
}
</script>
