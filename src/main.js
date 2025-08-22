import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/auth'

loadFonts()

const app = createApp(App)

// Criar instância do Pinia
const pinia = createPinia()

// Registrar Pinia antes de chamar store
app.use(pinia)
app.use(router)
app.use(vuetify)

// Agora que o Pinia já está ativo, pode acessar o store
const auth = useAuthStore()
auth.carregarTokenLocal()

app.mount('#app')
