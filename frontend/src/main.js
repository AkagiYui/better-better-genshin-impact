import { createApp } from "vue"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import { createPinia } from "pinia"
import { PiniaColada } from "@pinia/colada"
import { PiniaColadaAutoRefetch } from "@pinia/colada-plugin-auto-refetch"
import App from "./App.vue"
import router from "./route"

const app = createApp(App)
const pinia = createPinia()

app.use(Antd)
app.use(router)
app.use(pinia)
app.use(PiniaColada, {
  queryOptions: {
    // change the stale time for all queries to 0ms
    staleTime: 0,
  },
  mutationOptions: {
    // add global mutation options here
  },
  plugins: [
    // add Pinia Colada plugins here
    PiniaColadaAutoRefetch({
      // global default (can be overridden per-query)
      autoRefetch: true,
    }),
  ],
})

app.mount("#app")
