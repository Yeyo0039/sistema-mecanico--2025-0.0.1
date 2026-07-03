import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { routes } from '../frontend/src/router/routes.ts'

//styles
import './assets/css/resert.css'
import './assets/css/variables.css'
import './assets/css/global.css'

App.use(createPinia())
App.use(routes)

App.mount('#app')
