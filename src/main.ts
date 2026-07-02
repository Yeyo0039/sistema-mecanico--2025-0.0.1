import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//styles
import './assets/css/resert.css'
import './assets/css/variables.css'
import './assets/css/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
