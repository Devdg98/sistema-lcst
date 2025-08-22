<template>
  <v-container fluid class="fill-height pa-0">
    <v-bottom-navigation
      app
      fixed
      :elevation="3"
      color="white"
      class="bottom-nav"
    >
      <v-btn value="estoque" to="/estoqueGerencial">
        <v-icon>mdi-package-variant-closed</v-icon>
        Estoque
      </v-btn>

      <v-btn value="pedidos" to="/pedidosGerencial">
        <v-icon>mdi-format-list-bulleted</v-icon>
        Pedidos
      </v-btn>

      <v-btn value="entrega" to="/entregaGerencial">
        <v-icon>mdi-truck-fast</v-icon>
        Entrega
      </v-btn>
    </v-bottom-navigation>

    <v-row no-gutters justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-8 ma-2" flat>
          <div class="text-center mb-6">
            <v-avatar size="100">
              <v-img src="https://images-offstore.map.azionedge.net/compressed/3f0eb4d40704bfb0651d9bb7f9bc045c.jpg"></v-img>
            </v-avatar>
          </div>

          <v-alert
            v-if="mensagem"
            :type="mensagemTipo"
            variant="tonal"
            class="mb-4"
          >
            {{ mensagem }}
          </v-alert>

          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="E-mail"
              outlined
              dense
              class="mb-4"
              type="email"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Senha"
              outlined
              dense
              class="mb-4"
              type="password"
              required
            ></v-text-field>

            <v-btn
              color="#002D18"
              class="white--text"
              block
              x-large
              to="/Lcst"
              :loading="loading"
            >
              Entrar
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const mensagem = ref('');
const mensagemTipo = ref('success');

const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  mensagem.value = '';
  loading.value = true;

  if (!email.value || !password.value) {
    mensagem.value = 'Preencha todos os campos.';
    mensagemTipo.value = 'error';
    loading.value = false;
    return;
  }

  try {
    const response = await axios.post('http://192.168.18.136:2998/auth/login', {
      email: email.value.trim(),
      senha: password.value,
    });

    const { token, usuario } = response.data;

    // Salvar token e usuário no store
    authStore.token = token;
    authStore.usuario = usuario;

    mensagem.value = 'Login realizado com sucesso!';
    mensagemTipo.value = 'success';

    // Redirecionar para dashboard ou página inicial gerencial
    router.push('/gerencia-pedidos');
  } catch (err) {
    console.error(err.response?.data || err.message);
    mensagem.value = err.response?.data?.mensagem || 'Erro ao efetuar login.';
    mensagemTipo.value = 'error';
  } finally {
    loading.value = false;
  }
};
</script>
