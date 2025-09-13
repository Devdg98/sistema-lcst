<template>
  <!-- AppBar 1: Frete Grátis -->
  <v-app-bar color="white" class="custom-app-bar-1" flat>
    <div class="frete-texto">
      Frete Grátis para Todo o Brasil
    </div>
  </v-app-bar>

  <!-- AppBar 2: Logo à esquerda / Ícones à direita -->
  <v-app-bar color="#000000" class="custom-app-bar-2 mt-n6" flat>
    <!-- Logo à esquerda -->
    <router-link to="/">
<v-avatar
      
      image="https://images-offstore.map.azionedge.net/compressed/3f0eb4d40704bfb0651d9bb7f9bc045c.jpg"
      size="44"
      class="ms-2"
    ></v-avatar>
      </router-link>
    <v-btn icon @click="abrirBusca" >
  <v-icon color="white">mdi-magnify</v-icon>
</v-btn>

    <!-- Espaço entre logo e ícones -->
    <v-spacer />

    

<v-badge :content="carrinho.itens.length" color="green" offset-x="4" offset-y="4" bordered>
  <v-btn icon size="24" class="me-2" to="/carrinho/checkout">
    <v-avatar
      image="https://images-offstore.map.azionedge.net/compressed/3f0eb4d40704bfb0651d9bb7f9bc045c.jpg"
      size="32"
    ></v-avatar>
  </v-btn>
</v-badge>

<v-bottom-sheet v-model="loginModel">
  <template #activator="{ props: activatorProps }">
    <v-btn icon size="48" class="ml-1 mr-n2" v-bind="activatorProps">
      <v-icon color="white">mdi-account-outline</v-icon>
    </v-btn>
  </template>
  <v-toolbar class="toolbar" flat color="#000000">
      <v-toolbar-title class="text-h6">Login / Cadastro </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="loginModel = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
  <v-card class="pa-4">
    
    <v-list>
  <!-- BLOCO DESLOGADO -->
   <div v-if="!auth.estaLogado">
<v-list-item
    
    class="pa-2 login"
  >
    <div class="pa-0 mt-2 d-flex align-center titulo-model">
      <v-icon class="mr-2">mdi-account</v-icon>
      Iniciar Sessão / Criar Uma Conta
    </div>
    <div class="mt-2 pa-0">
      <p class="mt-2 pa-0 loginModel">Já é Membro ?</p>
      <p class="mt-2 pa-0 login2Model">
        Inicie Sessão para desfrutar das ofertas de membros PedroLcst
      </p>
    </div>
    <div class="pa-0 mt-2">
      <v-btn
        to="/login"
        class="btnloginmodel mt-2 pa-4"
        size="x-large"
        @click="loginModel = false"
      >
        INICIAR SESSÃO
      </v-btn>
    </div>
    <v-card-text class="pa-0 mt-2 mb-6 login2Model">
      Ainda não é cliente ?
      <router-link
        to="/cadastro"
        class="rota-texto2"
        @click="loginModel = false"
      >
        Criar Conta
      </router-link>
    </v-card-text>
  </v-list-item>
  <v-list-item
    class="pa-2 mt-6"
    link
    color="#000000"
    to="/consultarEncomenda"
    @click="loginModel = false"
  >
    <v-list-item-title class="btn-menu">
      <v-icon class="mr-2">mdi-truck</v-icon>
      Consultar a Encomenda
    </v-list-item-title>
    <template #append>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-list-item>
   </div>
  

  <!-- BLOCO LOGADO -->
  <v-list-item
    v-else
    class="pa-2"
  >
    <p class="pa-0 mt-2 tituloConta">
      <v-icon class="mr-2">mdi-account</v-icon>A minha conta
    </p>
    <p class="mt-2 pa-0 logado">Olá {{ usuariologado }}</p>
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
        class="btnloginmodel mt-2 pa-4"
        size="x-large"
      >
        FECHAR SESSÃO
      </v-btn>
    </div>
  </v-list-item>




  
</v-list>

  </v-card>
</v-bottom-sheet>
  
    <!-- Nav icon (menu) -->
    <v-app-bar-nav-icon
    class=""
    @click.stop="menuAberto = !menuAberto" 
    @click="buscaAberta = false"
  />

  <!-- Gaveta com altura personalizada -->
 

  </v-app-bar>
  
  <!-- Bottom Sheet de Busca -->
<v-navigation-drawer 
    v-model="buscaAberta"
    class="mt-n8 "
    location="left"
    color="#000000"
    :width="700"
    temporary
    elevation="0" style="height: 100%; display: flex; flex-direction: column;"
  >
  <v-card class="rounded-0">
  <v-toolbar color="#000000">
    <v-text-field
      v-model="termoBusca"
      placeholder="Digite o nome do produto"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      style="flex: 1; max-width: calc(100% - 48px);"
      hide-details
    />
    <v-btn icon @click="buscaAberta = false">
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>
  </v-toolbar>

  <v-card-text class="py-4">
    <v-card-subtitle class="tituloBusca pa-0">OS MAIS BUSCADOS</v-card-subtitle>
    <div class="mt-2">
      <router-link to="/cadastro" class="rota-texto3 mr-2">boné</router-link>
      <router-link to="/cadastro" class="rota-texto3 mr-2">tenis</router-link>
      <router-link to="/cadastro" class="rota-texto3 mr-2">moletom</router-link>
      <router-link to="/cadastro" class="rota-texto3 mr-2">polo</router-link>
      <router-link to="/cadastro" class="rota-texto3 mr-2">camiseta</router-link>
    </div>
  </v-card-text>

<v-divider class=" divider-start" />

<v-card-text class="py-4">
  <v-card-subtitle class="tituloBusca pa-0">
    {{ quantidadeFiltrados }} produto{{ quantidadeFiltrados === 1 ? '' : 's' }} encontrado{{ quantidadeFiltrados === 1 ? '' : 's' }}
  </v-card-subtitle>
  <v-divider class="divider-end" color="#000000"/>


    <v-row class="mt-4">
      <v-col
        v-for="produto in produtosFiltrados"
        :key="produto.id"
        cols="6"
        @click="irParaProduto(produto)"
      >
        <v-card class="rounded-0 border" elevation="0" height="280">
          <v-img
            :src="obterUrlImagem(produto.imagensProdutos?.[0])"
            height="200"
            cover
            class="rounded-0"
          />
          <v-card-text class="pa-2 mt-2">
            <div class="descricaoTitulo">
              {{ produto.descricaoProduto }}
            </div>
            <div class="textosProduto mt-2">
              {{ formatarPreco(produto.valorProduto) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>

  <v-alert
    v-if="produtosFiltrados.length === 0 && termoBusca"
    type="info"
    class="mt-4"
    border="start"
    variant="outlined"
    style="padding-top: 64px;"
  >
    Nenhum produto encontrado.
  </v-alert>
</v-card>
</v-navigation-drawer>

<v-navigation-drawer
  v-model="menuAberto"
  location="right"
  color="#000000"
  width="600"
  
  class="mt-n8"
  elevation="0" style=" height: 100%; display: flex; flex-direction: column; overflow-y: auto;"
  
>

<v-tabs
  v-model="tab"
  bg-color="#000000"
  class="text-white"
  @update:model-value="categoriaAberta = false"
>
  <v-tab value="lacoste">LACOSTE</v-tab>
  <v-tab value="hugoboss">HUGOBOSS</v-tab>
  <v-tab value="explorar">EXPLORAR</v-tab>
</v-tabs>

<v-window v-model="tab">
  <v-window-item value="lacoste">
    <v-list>
      <v-list-item >Início</v-list-item>
      <v-divider />

      <v-list-item
        v-for="(links, categoria) in categoriasPorMarca.lacoste"
        :key="categoria"
        class="pa-2"
        link
        color="#000000"
        @click="abrirCategoria(categoria)"
      >
        <v-list-item-title class="btn-menu">{{ categoria.toUpperCase() }}</v-list-item-title>
        <template #append><v-icon>mdi-chevron-right</v-icon></template>
      </v-list-item>
       <v-divider />
      <div v-if="!auth.estaLogado">
      <v-list-item class="pa-2 login">

      <div class="pa-0 mt-2 d-flex align-center">

      <v-icon class="mr-2">mdi-account</v-icon>
      <router-link to="/login" class="pa-0 rota-texto">Iniciar Sessão</router-link> / <router-link to="/cadastro" class="pa-0 rota-texto">Criar Conta</router-link> </div>
      <div class="mt-2 pa-0 login">
      <p class="mt-2 pa-0 login2">Já é Membro ?</p>
      <p class="mt-2 pa-0 login">Inicie Sessão para desfrutar das ofertas de membros PedroLcst</p> </div>
      <div class="pa-0 mt-2"> <v-btn to="/login" class="botaolacoste2 mt-2 pa-4" size="x-large"> INICIAR SESSÃO </v-btn> </div>
      <v-card-text class="pa-0 mt-2 mb-6 login"> Ainda não é cliente ? <router-link to="/cadastro" class="rota-texto">Criar Conta</router-link>
      </v-card-text>
      </v-list-item>

      <v-divider />
      <v-list-item class="pa-2 mt-2" link color="#000000" to="/consultarEncomenda" >
      <v-list-item-title class="btn-menu"><v-icon class="mr-2">mdi-truck</v-icon>Consultar a Encomenda</v-list-item-title>

      <template #append>
      <v-icon>mdi-chevron-right</v-icon>
      </template>

      </v-list-item>
      </div>

      <v-list-item class="pa-2" v-else>
        <p class="pa-0 mt-2 tituloConta"><v-icon class="mr-2">mdi-account</v-icon>A minha conta</p>
        <p class="mt-2 pa-0 logado" v-if="auth.estaLogado">Olá {{ usuariologado }}</p>
        <p class="mt-4 pa-0"> <router-link to="/perfilCliente" class="rota-texto-logado">Meu Perfil</router-link></p> 
        <p class="mt-2 pa-0"> <router-link to="/pedidosCliente" class="rota-texto-logado">Minhas encomendas</router-link></p>
        <div class="pa-0 mt-2"> <v-btn  @click="logout" class="botaolacoste2 mt-2 pa-4" size="x-large"> FECHAR SESSÃO </v-btn> </div>
      </v-list-item>
      </v-list>
  </v-window-item>

  <v-window-item value="hugoboss">
    <v-list>
    <v-list-item >Início</v-list-item>
      <v-divider />

      <v-list-item
        v-for="(links, categoria) in categoriasPorMarca.hugoboss"
        :key="categoria"
        class="pa-2"
        link
        color="#000000"
        @click="abrirCategoria(categoria)"
      >
        <v-list-item-title class="btn-menu">{{ categoria.toUpperCase() }}</v-list-item-title>
        <template #append><v-icon>mdi-chevron-right</v-icon></template>
      </v-list-item>
 <v-divider />

<div v-if="!auth.estaLogado">
<v-list-item class="pa-2 login">

<div class="pa-0 mt-2 d-flex align-center">

<v-icon class="mr-2">mdi-account</v-icon>
<router-link to="/login" class="pa-0 rota-texto">Iniciar Sessão</router-link> / <router-link to="/cadastro" class="pa-0 rota-texto">Criar Conta</router-link> </div>
<div class="mt-2 pa-0 login">
<p class="mt-2 pa-0 login2">Já é Membro ?</p>
<p class="mt-2 pa-0 login">Inicie Sessão para desfrutar das ofertas de membros PedroLcst</p> </div>
<div class="pa-0 mt-2"> <v-btn to="/login" class="botaolacoste2 mt-2 pa-4" size="x-large"> INICIAR SESSÃO </v-btn> </div>
<v-card-text class="pa-0 mt-2 mb-6 login"> Ainda não é cliente ? <router-link to="/cadastro" class="rota-texto">Criar Conta</router-link>
</v-card-text>
</v-list-item>

<v-divider />
<v-list-item class="pa-2 mt-2" link color="#000000" to="/consultarEncomenda" >
<v-list-item-title class="btn-menu"><v-icon class="mr-2">mdi-truck</v-icon>Consultar a Encomenda</v-list-item-title>

<template #append>
<v-icon>mdi-chevron-right</v-icon>
</template>

</v-list-item>
</div>

<v-list-item class="pa-2" v-else>
   <p class="pa-0 mt-2 tituloConta"><v-icon class="mr-2">mdi-account</v-icon>A minha conta</p>
   <p class="mt-2 pa-0 logado" v-if="auth.estaLogado">Olá {{ usuariologado }}</p>
   <p class="mt-4 pa-0"> <router-link to="/perfilCliente" class="rota-texto-logado">Meu Perfil</router-link></p> 
   <p class="mt-2 pa-0"> <router-link to="/pedidosCliente" class="rota-texto-logado">Minhas encomendas</router-link></p>
   <div class="pa-0 mt-2"> <v-btn  @click="logout" class="botaolacoste2 mt-2 pa-4" size="x-large"> FECHAR SESSÃO </v-btn> </div>
</v-list-item>



      </v-list>
  </v-window-item>
</v-window>

</v-navigation-drawer>

<!-- Gaveta de NOVIDADES -->
<v-navigation-drawer
  v-model="categoriaAberta"
  location="right"
  color="#000000"
  width="600"
  temporary
  
  class="gaveta-categorias"
  :key="gavetaAtiva"
>

  <v-toolbar flat color="#000000">
    <v-btn icon @click="categoriaAberta = false">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title class="text-white">{{ tituloCategoria }}</v-toolbar-title>
  </v-toolbar>

  <v-divider />

  <v-list>
    <v-list-item
      v-for="(item, index) in itensCategoriaAtiva"
      :key="index"
      :to="item.route"
      link
      @click="navegarParaCategoria(item.route)"
    >
      <v-list-item-title class="text-white">{{ item.label }}</v-list-item-title>
    </v-list-item>
   
  </v-list>
</v-navigation-drawer>

</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()

// Nome do usuário logado (se existir)
const usuariologado = computed(() => auth.usuario?.nome || '')

// Função de logout
const logout = () => {
  auth.logout()
}
</script>

<script>
import { useCarrinhoStore } from '@/store/carrinho'
import { useProdutosLacoste } from '@/store/produtosLacoste'


export default {
  data() {
    return {
         
      categoriaAberta: false, 
      searchActivator: null,
      tab: 'lacoste',              
      termoBusca: '',
      focoBusca: false,
     
      menuAberto: false,
      buscaAberta: false,
      loginModel: false,
      gavetaAtiva: '',
      tituloCategoria: '', // A single variable for the category title
    
      categoriasPorMarca: {
      lacoste: {
        novidades: [
          { label: 'Sale', route: '/lacoste/vendidos' },
          { label: 'Vestuário', route: '/lacoste/vestuario' },
          { label: 'Calçados', route: '/lacoste/calcados' },
          { label: 'Acessórios', route: '/lacoste/acessorios21' }
        ],
        vestuario: [
          { label: 'Polos', route: '/lacoste/vestuario/polos' },
          { label: 'Camisetas', route: '/lacoste/vestuario/camisetas' },
          { label: 'Suéteres & Moletons', route: '/lacoste/vestuario/sueters&moletom' },
          { label: 'Calças & Bermudas', route: '/lacoste/vestuario/calcas&bermudas' },
        ],
        calcados: [
          { label: 'Tênis', route: '/lacoste/calcados' },
          { label: 'Chinelos', route: '/calcados/chinelos' }
        ],
        acessorios: [
          { label: 'Bonés & Chapeus', route: '/lacoste/acessorios/bones&chapeus' },
          { label: 'Mochilas & Bolsas', route: '/lacoste/acessorios/mochilas&bolsas' }
        ],
      },
      hugoboss: {
        novidades: [
        { label: 'Novidades', route: '/hugo/catalogo' },
        { label: 'Vestuário', route: '/hugo/vestuario' },
        { label: 'Calçados', route: '/hugo/calcados' },
        { label: 'Acessórios', route: '/hugo/acessorios' }
      ],
      vestuario: [
        { label: 'Polos', route: '/hugo/polos' },
        { label: 'Camisetas', route: '/hugo/camisetas&regatas' },
        { label: 'Suéteres & Moletons', route: '/hugo/moletons' },
        { label: 'Calças & Bermudas', route: '/hugo/shorts&bermudas' },
      ],
      calcados: [
        { label: 'Chinelos', route: '/hugo/calcados' }
      ],
      acessorios: [
        { label: 'Bonés & Chapeus', route: '/hugo/bones&chapeus' },
      ],
      },
      

    },
  }
  },

  computed: {

itensCategoriaAtiva() {
    // Check if the tab and active category exist in your data structure
    if (this.categoriasPorMarca[this.tab] && this.categoriasPorMarca[this.tab][this.gavetaAtiva]) {
      return this.categoriasPorMarca[this.tab][this.gavetaAtiva];
    }
    return [];
  },

    carrinho() {
      return useCarrinhoStore()
    },
    produtosFiltrados() {
      const catalogo = useProdutosLacoste() // acesso reativo direto ao store
      return catalogo.produtos.filter(prod =>
        prod.descricaoProduto?.toLowerCase().includes(this.termoBusca.toLowerCase())
      )
    },
    quantidadeFiltrados() {
      return this.produtosFiltrados.length
    }
  },
 created() {
    this.catalogo = useProdutosLacoste()
  },
  mounted() {
    // Associa o ref usado no campo de busca ao ativador do v-menu
    this.searchActivator = this.$refs.searchFieldActivator

    // Carrega produtos se ainda não estiverem carregados
    const catalogo = useProdutosLacoste()
    if (catalogo.produtos.length === 0) {
      catalogo.carregarProdutos()
    }
  },

  methods: {
  abrirCategoria(categoria) {
  this.categoriaAberta = false;   // fecha gaveta atual
  this.gavetaAtiva = null;        // limpa a variável
  
  this.$nextTick(() => {
    this.gavetaAtiva = categoria;

    const titulos = {
      novidades: 'Novidades',
      vestuario: 'Vestuário',
      calcados: 'Calçados',
      acessorios: 'Acessórios',
    };
    this.tituloCategoria = titulos[categoria] || 'Categoria';

    this.categoriaAberta = true;  // abre novamente
  });
},

  navegarParaCategoria(route) {
    this.$router.push(route);
    this.menuAberto = false;
    this.categoriaAberta = false;
  },
    abrirMenu() {
    this.menuAberto = true
    this.buscaAberta = false // fecha a busca se aberta
  },
 abrirBusca() {
  if (!this.buscaAberta) {
    // Vai abrir a busca
    this.menuAberto = false
    this.termoBusca = ''
  }
  this.buscaAberta = !this.buscaAberta
},




calcularDesconto(precoFinal, precoOriginal) {
  if (!precoFinal || !precoOriginal || precoFinal >= precoOriginal) return 0;
  return Math.round(((precoOriginal - precoFinal) / precoOriginal) * 100);
},


    obterUrlImagem(img) {
      if (img?.startsWith('http')) return img
      return `https://pedro-lacst.s3.us-west-2.amazonaws.com/${img}`
    },

    formatarPreco(valor) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor || 0)
    },

    gerarSlug(descricao) {
      return descricao
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
    },

    irParaProduto(produto) {
      const slug = this.gerarSlug(produto.descricaoProduto)
      this.termoBusca = ''
      this.focoBusca = false
      this.buscaAberta = false
      this.$router.push(`/produto/${slug}`)
    }
  }
}
</script>

<style scoped>
.divider-start {
  width: 50%; /* Ou o percentual que você preferir */
  margin-right: auto; /* Alinha à esquerda */
}

.divider-end {
  width: 50%; /* Mesma largura */
  margin-left: auto; /* Alinha à direita */
}
.border {
  border: 1px solid #424242;
}
.botaolacoste2{
  background-color: #ffffff !important;
  color: #000000 !important;
  font-weight: 400;
  font-size: 10px;
  border-radius: 0 !important;
}
.botaolacoste {
  background-color: #000000 !important;
  color: white !important;
  font-weight: 500;
  font-size: 14px;
  border-radius: 0 !important;
}
.toolbar {
  border: 1px solid #000000; /* Borda cinza clara */
  background-color: #fff; /* Fundo branco sólido */
}
.toolbar2 {
  border: 1px solid #000000; /* Borda cinza clara */
  background-color: #fff; /* Fundo branco sólido */
}
.custom-app-bar-1 {
  min-height: 40px !important;
  height: 40px !important;
  color: #000000;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.frete-texto {
  text-align: center;
  width: 100%;
}
.logado{
    font-size: 18px;
    font-weight:500;
}
.rota-texto-logado{
    color:#fff;
    font-size: 18px;
    font-weight:400;
    text-decoration:underline; 
}
.rota-texto3 {
  color:#000000;
  font-size: 16px;
  font-weight:300;
   text-decoration:underline; /* Remove a linha de sublinhado */
}
.rota-texto2 {
  color:#000000;
  font-size: 18px;
  font-weight:400;
   text-decoration:underline; /* Remove a linha de sublinhado */
}
.rota-texto {
  /* Propriedades que você já tem */
  color:#fff;
  font-size: 18px;
  font-weight:400;
   text-decoration: none; /* Remove a linha de sublinhado */
}
.custom-app-bar-2 {
  color: white;
  min-height: 60px !important;
  height: 60px !important;
  display: flex;
  align-items: center;
}
.tituloConta{
    font-size: 18px;
    font-weight: 400;
}
.titulo {
  font-size: 24px;
  color: #000000;
  font-weight: 400;
  text-transform: uppercase;
}
.toolb-scroll {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  display: flex;
  font-size: 20px;
  
}
.toolb-scroll .toolb {
  flex: 0 0 auto;
}

.textosProduto {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
}
.descricaoTitulo {
  font-size: 12px;
  color: #000000;
  font-weight: 400;
}
.tituloBusca {
  font-size: 20px;
  color: #000000;
  font-weight: 400;
  text-transform: uppercase;
}
.btn-menu{
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
}
.btn-menu1{
  font-size: 14px;
  font-weight: 300;
}
.login{
  font-size: 18px;
  font-weight: 300;

}
.login2{
  font-size: 18px;
  font-weight: 500;
}
.gaveta-categorias{
   z-index: 3000 !important;
}
.titulo-model {
  font-size: 18px;
  color: #000000;
  font-weight: 400;
  text-transform: uppercase;
}
.loginModel {
  font-size: 16px;
  color: #000000;
  font-weight: 500;
}
.login2Model {
  font-size: 16px;
  color: #000000;
  font-weight: 400;
}
.btnloginmodel {
  font-size: 16px;
  background-color: #000000;
  color: white;
  font-weight: 500;
}
</style>