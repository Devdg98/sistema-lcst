<template>
  <v-container fluid class="fill-height pa-0 d-flex flex-column align-center mt-12  ">
   <div class="text-center mb-6">
            <v-avatar size="100">
              <v-img src="https://images-offstore.map.azionedge.net/compressed/3f0eb4d40704bfb0651d9bb7f9bc045c.jpg"></v-img>
            </v-avatar>
            <div class="text-h6 font-weight-bold mt-4">Consultar a Encomenda</div>
            <div class="text-subtitle font-weight-bold mt-4">Para consultar a sua encomenda, por favor preencha o formulario abaixo</div>
        </div>

          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="Numero de Encomenda"
              outlined
              dense
              class="mb-4"
              type="email"
              required
            ></v-text-field>

            <v-btn
              type="submit"
              block
              x-large
              color="#002D18"
              class="white--text"
            >
              Consultar a Minha Encomenda
            </v-btn>

            <v-alert
              v-if="auth.error"
              type="error"
              class="mt-4"
              border="start"
              variant="outlined"
            >
              {{ auth.error }}
            </v-alert>
          </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const email = ref('')
const senha = ref('')
const auth = useAuthStore()
const router = useRouter()

const login = async () => {
  await auth.login(email.value, senha.value)

  if (auth.token) {
    router.push('/carrinho')
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>