<template>
  <v-container>
    <h2 class="text-h5 mb-4">Cadastrar Usuário Gerencial</h2>

    <v-alert
      v-if="mensagem"
      :type="mensagemTipo"
      variant="tonal"
      class="mb-4"
    >
      {{ mensagem }}
    </v-alert>

    <v-form ref="form">
      <v-text-field
        v-model="usuario.nome"
        label="Nome"
        :rules="[v => !!v || 'O nome é obrigatório']"
        required
      ></v-text-field>

      <v-text-field
        v-model="usuario.sobrenome"
        label="Sobrenome"
        :rules="[v => !!v || 'O sobrenome é obrigatório']"
        required
      ></v-text-field>

      <v-text-field
        v-model="usuario.email"
        label="E-mail"
        type="email"
        :rules="[v => !!v || 'O e-mail é obrigatório']"
        required
      ></v-text-field>

      <v-text-field
        v-model="usuario.senha"
        label="Senha"
        type="password"
        :rules="[v => !!v || 'A senha é obrigatória']"
        required
      ></v-text-field>

      <v-select
        v-model="usuario.role"
        :items="roles"
        label="Perfil"
        :rules="[v => !!v || 'Selecione um perfil']"
        required
      ></v-select>

      <v-btn
        color="primary"
        :loading="loading"
        @click="cadastrarUsuario"
        block
      >
        Cadastrar
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const usuario = ref({
  nome: '',
  sobrenome: '',
  email: '',
  senha: '',
  role: 'gerente',
});

const roles = ['gerente', 'admin'];
const loading = ref(false);
const mensagem = ref('');
const mensagemTipo = ref('success');

const form = ref(null);
const authStore = useAuthStore();

const cadastrarUsuario = async () => {
  mensagem.value = '';
  loading.value = true;

  const dados = {
    nome: usuario.value.nome.trim(),
    sobrenome: usuario.value.sobrenome.trim(),
    email: usuario.value.email.trim(),
    senha: usuario.value.senha,
    role: usuario.value.role,
  };

  // Validação de campos
  if (!dados.nome || !dados.sobrenome || !dados.email || !dados.senha || !dados.role) {
    mensagem.value = 'Preencha todos os campos.';
    mensagemTipo.value = 'error';
    loading.value = false;
    return;
  }

  if (dados.senha.length < 6) {
    mensagem.value = 'A senha deve ter no mínimo 6 caracteres.';
    mensagemTipo.value = 'error';
    loading.value = false;
    return;
  }

  try {
    // Se houver token, envia no header; se não, tenta cadastrar o primeiro admin
    const headers = authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {};

    const resposta = await axios.post(
      'http://192.168.18.136:2998/auth/register',
      dados,
      { headers }
    );

    mensagem.value = resposta.data.mensagem;
    mensagemTipo.value = 'success';

    // Resetar formulário
    usuario.value = { nome: '', sobrenome: '', email: '', senha: '', role: 'gerente' };
    form.value?.resetValidation();
  } catch (err) {
    console.error('Erro do backend:', err.response?.data || err.message);
    mensagem.value = err.response?.data?.mensagem || 'Erro ao cadastrar usuário.';
    mensagemTipo.value = 'error';
  } finally {
    loading.value = false;
  }
};
</script>
