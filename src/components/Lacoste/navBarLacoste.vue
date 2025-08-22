<template>
  <!-- App Bar Principal -->
  <v-app-bar color="#002D18" dark flat>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="d-md-none" />

    <!-- Tabs de navegação principal -->
    <v-tabs
      v-model="tab"
      dark
      show-arrows
      align-tabs="center"
      class="flex-grow-1 justify-center"
    >
      <v-tab
        v-for="(item, index) in opcoes"
        :key="index"
        @click="navegarPara(item.route, index)"
        class="text-capitalize"
      >
        <v-icon start>{{ item.icon }}</v-icon> {{ item.label }}
      </v-tab>
    </v-tabs>
    <div class="mr-4 font-mono">{{ horaAtual }}</div>
  </v-app-bar>

  <!-- App Bar Secundária -->
  <v-app-bar color="#002D18" dark dense flat scroll-behavior="hide">


      

    <div class="d-flex justify-center flex-wrap w-100 px-2">

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="#002D18" v-bind="props" class="text-white" variant="text">
            Novidades
          </v-btn>
        </template>
        <v-list class="menu-list">
          <v-list-item
            v-for="(item, index) in novidades"
            :key="index"
            @click="navegarParaSecundario(item.route)"
          >
            <v-list-item-title class="text-center w-100">{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="#002D18" v-bind="props" class="text-white" variant="text">
            Vestuário
          </v-btn>
        </template>
        <v-list class="menu-list">
          <v-list-item
            v-for="(item, index) in vestuario"
            :key="index"
            @click="navegarParaSecundario(item.route)"
          >
            <v-list-item-title class="text-center w-100">{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="#002D18" v-bind="props" class="text-white" variant="text">
            Calçados
          </v-btn>
        </template>
        <v-list class="menu-list">
          <v-list-item
            v-for="(item, index) in calcados"
            :key="index"
            @click="navegarParaSecundario(item.route)"
          >
            <v-list-item-title class="text-center w-100">{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="#002D18" v-bind="props" class="text-white" variant="text">
            Acessórios
          </v-btn>
        </template>
        <v-list class="menu-list">
          <v-list-item
            v-for="(item, index) in acessorios"
            :key="index"
            @click="navegarParaSecundario(item.route)"
          >
            <v-list-item-title class="text-center w-100">{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-text-field label="Pesquisa">

    </v-text-field>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>   <!--Icone Carrinho-->
    <v-app-bar-nav-icon></v-app-bar-nav-icon>   <!--IconeLogin-->

  </v-app-bar>

  <!-- Drawer lateral para mobile -->
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    class="bg-blue-grey-darken-4"
  >
    <v-list nav dense>
      <v-list-item
        v-for="(item, index) in opcoes"
        :key="index"
        @click="navegarPara(item.route, index); drawer = false"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="white--text">
            {{ item.label }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      tab: 0,
      drawer: false,
      horaAtual: '',
      opcoes: [
        { label: 'Lacoste', route: '/lacoste', icon: 'mdi-home' },
        { label: 'Hugo', route: '/CadastroP2', icon: 'mdi-tshirt-crew' },
        { label: 'Boss', route: '/ConsultaP1', icon: 'mdi-account' },
      ],

      novidades: [
        { label: 'Vestuário', route: '/lacoste/novidades' },
        { label: 'Calçados', route: '/novidades/calcados' },
        { label: 'Acessórios', route: '/novidades/acessorios' }
      ],

      vestuario: [
        { label: 'Polos', route: '/vestuario/polos' },
        { label: 'Camisetas', route: '/vestuario/camisetas' },
        { label: 'Suéteres & Moletons', route: '/vestuario/sueteres' },
        { label: 'Conjunto', route: '/vestuario/conjunto' },
        { label: 'Tracksuit', route: '/vestuario/tracksuit' },
        { label: 'Camisas', route: '/vestuario/camisas' },
        { label: 'Calças & Bermudas', route: '/vestuario/calcas-bermudas' },
        { label: 'Beachwear', route: '/vestuario/beachwear' },
        { label: 'Cuecas', route: '/vestuario/cuecas' },
        { label: 'Meias', route: '/vestuario/meias' }
      ],

      calcados: [
        { label: 'Tênis', route: '/calcados/tenis' },
        { label: 'Chinelos', route: '/calcados/chinelos' }
      ],

      acessorios: [
        { label: 'Bonés & Chapeus', route: '/acessorios/bones' },
        { label: 'Mochilas & Bolsas', route: '/acessorios/mochilas' },
        { label: 'Carteiras', route: '/acessorios/carteiras' },
        { label: 'Óculos de Sol', route: '/acessorios/oculos' },
        { label: 'Cintos', route: '/acessorios/cintos' },
        { label: 'Perfumes', route: '/acessorios/perfumes' }
      ]
    };
  },
  mounted() {
    const rotaAtual = this.$route.path;
    const indexAtual = this.opcoes.findIndex(item => item.route === rotaAtual);
    if (indexAtual !== -1) {
      this.tab = indexAtual;
    }

    this.$nextTick(() => {
      this.atualizarHora();
      this.intervaloRelogio = setInterval(this.atualizarHora, 1000);
    });
  },
  beforeUnmount() {
    clearInterval(this.intervaloRelogio);
  },
  methods: {
    navegarPara(route, index) {
      this.tab = index;
      this.$router.push(route);
    },
    navegarParaSecundario(route) {
      this.$router.push(route);
    },
    atualizarHora() {
      const agora = new Date();
      this.horaAtual = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.bg-custom {
  background-color: #002D18 !important;
}
.text-white {
  color: white !important;
}
.v-tab {
  font-weight: 500;
}
.font-mono {
  font-family: monospace;
}

/* Responsivo: Campo de busca */
.search-box {
  width: 100%;
  max-width: 1024px;
}

/* Menu responsivo */
.menu-list {
  width: 100%;
  max-width: 100vw;
}
</style>

<!-- Sugestão: no style global (ex: App.vue), adicione isso: -->
<style>
html {
  contain: layout style;
}
</style>
