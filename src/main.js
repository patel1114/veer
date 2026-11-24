import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { reveal, split } from './composables/directives'

createApp(App).directive('reveal', reveal).directive('split', split).mount('#app')
