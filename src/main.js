import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { revealDirective } from './composables/useScrollReveal'

createApp(App).directive('reveal', revealDirective).mount('#app')
