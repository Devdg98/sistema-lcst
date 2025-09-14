<template>
  <v-navigation-drawer
    app
    
    :style="{ backgroundColor: '#000000' }"
    width="300"
  >
    <div class="text-center my-6">
      <v-avatar size="100">
        <v-img src="https://images-offstore.map.azionedge.net/compressed/3f0eb4d40704bfb0651d9bb7f9bc045c.jpg"></v-img>
      </v-avatar>
    </div>

<v-list dense nav>
  <v-list-item
    v-for="item in items"
    :key="item.title"
    :to="item.to"
    link
    class="white--text"
    :class="{ 'cadastro-produto-btn': item.special }"
  >
    <v-list-item-content>
      <v-list-item-title class="item-title-flex">
        <v-icon :color="item.color">{{ item.icon }}</v-icon>
        <span class="ml-4 item-text-uppercase">{{ item.title }}</span>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</v-list>

    <template #append>
      <v-divider></v-divider>
      <v-list-item class="pa-2">
        <div v-if="!auth.estaLogado">
          <div class="pa-0 mt-2 d-flex align-center white--text">
            <v-icon class="mr-2" color="white">mdi-account</v-icon>
            <span class="titulo-model">Iniciar Sessão / Criar Uma Conta</span>
          </div>
          <div class="mt-2 pa-0 white--text">
            <p class="mt-2 pa-0 loginModel">Já é Membro?</p>
            <p class="mt-2 pa-0 login2Model">
              Inicie Sessão para desfrutar das ofertas de membros PedroLcst
            </p>
          </div>
          <div class="pa-0 mt-2">
            <v-btn
              to="/login"
              class="btn-login-model mt-2 pa-4"
              size="x-large"
            >
              INICIAR SESSÃO
            </v-btn>
          </div>
          <v-card-text class="pa-0 mt-2 mb-6 login2Model">
            Ainda não é cliente?
            <router-link
              to="/cadastro"
              class="rota-texto2"
            >
              Criar Conta
            </router-link>
          </v-card-text>
        </div>

        <div v-else>
          <p class="pa-0 mt-2 titulo-conta white--text">
            <v-icon class="mr-2" color="white">mdi-account</v-icon>A minha conta
          </p>
          <p class="mt-2 pa-0 logado white--text">Olá {{ usuariologado }}</p>
          <p class="mt-4 pa-0">
            <router-link to="/perfilCliente" class="rota-texto2">
              Meu Perfil
            </router-link>
          </p>
          <p class="mt-2 pa-0">
            <router-link to="/pedidosCliente" class="rota-texto2">
              Minhas encomendas
            </router-link>
          </p>
          <div class="pa-0 mt-2">
            <v-btn
              @click="logout"
              class="btn-login-model mt-2 pa-4"
              size="x-large"
            >
              FECHAR SESSÃO
            </v-btn>
          </div>
        </div>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';

const auth = ref({
  estaLogado: true,
});

const usuariologado = ref('PedroLcst');

const items = ref([
  { title: 'Edição de Categorias', icon: 'mdi-folder-edit-outline', to: '/editCategorias', color: 'white' },
  { title: 'Edição de Destaques', icon: 'mdi-star-outline', to: '/editDestaques', color: 'white' },
  { title: 'Promoções', icon: 'mdi-tag-percent-outline', to: '/editPromocoes', color: 'white' },
  { title: 'Estoque', icon: 'mdi-package-variant-closed', to: '/estoqueGerencial', color: 'white' },
  { title: 'Clientes', icon: 'mdi-account-group-outline', to: '/gestaoUsuarios', color: 'white' },
  { title: 'Pedidos', icon: 'mdi-list-box-outline', to: '/gestaoPedidos', color: 'white' },
  { title: 'Expedição', icon: 'mdi-truck-fast-outline', to: '/gestaoExpedicao', color: 'white' },
  { title: 'Cadastrar Produto', icon: 'mdi-plus-circle-outline', to: '/cadastroProdutos', color: 'white', special: true },
]);

const logout = () => {
  console.log('Usuário deslogado!');
  auth.value.estaLogado = false;
};
</script>

<style scoped>
/* Estilos existentes */
/* Novo estilo para o título do item */
.item-title-flex {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alinha o conteúdo à esquerda */
}

.item-text-uppercase {
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px; /* Aumenta o tamanho da fonte */
  font-weight: 500; /* Deixa a fonte um pouco mais encorpada */
}

/* Estilo para o botão de cadastro de produto */
.cadastro-produto-btn {
  background-color: #2e7d32 !important;
  border-left: 5px solid #fff;
  font-weight: bold;
}

.cadastro-produto-btn .v-list-item-icon {
  color: #fff !important;
}

.cadastro-produto-btn .item-text-uppercase {
  font-weight: bold;
}
/* Estilos para a área de status */
.btn-login-model, .btn-login-model:hover {
  background-color: #004d1f !important;
  color: #fff !important;
  text-transform: uppercase;
}

.white--text {
  color: #fff !important;
}

.rota-texto2 {
  color: #4CAF50 !important;
  text-decoration: none;
}

.titulo-model, .titulo-conta, .loginModel, .login2Model, .logado {
  color: #fff;
}
</style>