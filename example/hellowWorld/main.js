import { createApp } from '../../lib/guide-min-vue.es.js';
import { App } from './App.js';
const rootComponent = document.querySelector("#app")
createApp(App).mount(rootComponent)