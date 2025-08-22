<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-8 ma-2" flat>
          <div class="text-center mb-6">
            <v-avatar size="100">
              <v-img src="https://images-offstore.map.azionedge.net/compressed/3f0eb4d40704bfb0651d9bb7f9bc045c.jpg"></v-img>
            </v-avatar>
            <div class="text-h6 font-weight-bold mt-4">Criar Conta</div>
          </div>

          <v-form @submit.prevent="registrar">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.nome"
                  label="Nome"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.sobrenome"
                  label="Sobrenome"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  label="E-mail"
                  type="email"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.senha"
                  label="Senha"
                  type="password"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.confirmacaoSenha"
                  label="Confirmar Senha"
                  type="password"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              block
              x-large
              class="mt-4 white--text"
              color="#002D18"
            >
              Cadastrar
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  nome: '',
  sobrenome: '',
  email: '',
  senha: '',
  confirmacaoSenha: ''
})

const registrar = async () => {
  await auth.registrar(form.value)

  if (auth.token) {
    router.push('/carrinho/checkout') // redireciona após cadastro
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>