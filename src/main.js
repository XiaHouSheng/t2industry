import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as _ from 'lodash';
import router from './routers'
import './style.css'


const app = createApp(App)
app.use(ElementPlus).use(router)
app.config.globalProperties._ = _;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')