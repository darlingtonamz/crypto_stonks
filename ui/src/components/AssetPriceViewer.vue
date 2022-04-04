<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
defineProps({
  selected: {
    type: Object,
    required: false
  },
  assets: {
    type: [String],
    default: []
  }
})
</script>

<template>
  <div>
    <WelcomeItem v-for="asset of assets"
    :key="asset.id"
    >
      <template #icon>
        <img
        v-if="asset"
        alt="Asset logo"
        style="object-fit: contain"
        :src="`/src/assets/logos/${asset.symbol.toLowerCase()}.svg`"
        width="30"
        height="30"  fill="currentColor" />
        <DocumentationIcon v-else />
      </template>
      <template #heading>
        
        <span v-if="selected && selected.symbol && asset.symbol">
            {{priceMap[`${selected.symbol}-${asset.symbol}`]}}
        </span>
        <span v-else>N/A</span>
        {{ asset.symbol }}
      </template>

      <span v-if="selected && selected.symbol && asset.symbol">
        <div>
          {{`${selected.symbol}-${asset.symbol}`}}
        </div>
      </span>
      <span v-else> ... </span>
    </WelcomeItem>

  </div>
</template>
<script>
import { get } from 'axios';
export default {
  data() {
    return {
      apiHost: 'api.amanze.local',
      prices: [],
      priceMap: {},
      isRefreshingPrices: false,
      lastPriceUpdateFromServer: null,
      socket: null,
    }
  },
  watch: {
    selected: function() {
      this.getPrices();
    },
    prices: function(prices) {
      prices.forEach((priceObj) => {
        this.priceMap[priceObj.symbol] = priceObj.price;
      });
    }
  },
  computed: {
    allPriceSymbols() {
      return this.prices.map((obj) => obj.symbol);
    }
  },
  methods: {
    getPrices() {
      this.isRefreshingPrices = true;
      const fsyms = this.selected.symbol;
      const tsyms = this.assets.map((asset) => asset.symbol).join(',');
      get(`http://${this.apiHost}/price?fsyms=${fsyms}&tsyms=${tsyms}`)
        .then((res) => {
          this.prices = res.data;
          this.isRefreshingPrices = false;
          // this.logServerForUpdatedPrice();
        })
        .catch((error) => {
          console.error(error);
          this.isRefreshingPrices = false;
        })
    },
    // logServerForUpdatedPrice() {
    //   const now = new Date().getTime();
    //   if (this.selected && (
    //     !this.lastPriceUpdateFromServer || 
    //     (now - this.lastPriceUpdateFromServer)/1000 > 3
    //   )) {
    //     // this.lastPriceUpdateFromServer = now;
    //     console.log('SENDIONG')
    //     this.socket.send(`HAS_UPDATE_FOR|${this.selected.symbol}`)
    //   }
    // }
  },
  mounted() {
    console.log(`The initial count is ${this.count}.`)
    this.socket = new WebSocket(`ws://${this.apiHost}/ws`);
    this.socket.onmessage = ({data}) => {
      console.log('Message from server', data, typeof data, data.toString('utf8'));
      if (typeof data === 'string' && data.startsWith("{")) {
        if (data === 'REFRESH_PRICES') {
          this.getPrices();
        }        
        console.log('------', );
        let parsedData;
        try {
          parsedData = JSON.parse(data)
        } catch (error) {
          console.warn('Unable to parse data from WS Server', error)
        }
        if (parsedData) {
          if (
            parsedData.message &&
            parsedData.message === 'ASSET_PRICE_UPDATED'
          ) {
            console.log('Fetching new price')
            this.getPrices();
            // const ava
            // (parsedData.data || []).filter((assetPrice) => {
            //   return this.allPriceSymbols.includes(assetPrice);
            //   // if (this.allPriceSymbols.includes(assetPrice)) {
            //   //   this.prices.find((obj) => obj.symbol === assetPrice.symbol)
            //   // }
            // })
          }
        }
      }
    }
  }
}
</script>
