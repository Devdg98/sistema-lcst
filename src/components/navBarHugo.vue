<template>
  <v-app-bar color="#000000" dark dense flat scroll-behavior="hide">

    <!-- Ícone de menu para mobile -->
    <v-app-bar-nav-icon class="d-sm-none" @click.stop="drawer = !drawer" />

    <!-- Menus de categorias (visível em telas médias/grandes) -->
    <div class="d-none d-sm-flex align-center">
      <v-menu v-for="(grupo, index) in gruposCategorias" :key="index">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" class="text-white">
            {{ grupo.nome }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in grupo.itens"
            :key="i"
            @click="navegarParaSecundario(item.route)"
          >
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
        
      </v-menu>
      
    </div>


  </v-app-bar>

  <!-- Drawer lateral (para mobile) -->
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
      drawer: false,
      tab: 0,
      horaAtual: '',
      opcoes: [
        { label: 'Lacoste', route: '/lacoste', icon: 'mdi-home' },
        { label: 'HugoBoss', route: '/CadastroP2', icon: 'mdi-tshirt-crew' },
      ],
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
        { label: 'Cuecas', route: '/lacoste/vestuario/cuecas' }
      ],
      calcados: [
        { label: 'Tênis', route: '/lacoste/calcados' },
        { label: 'Chinelos', route: '/calcados/chinelos' }
      ],
      acessorios: [
        { label: 'Bonés & Chapeus', route: '/lacoste/acessorios/bones&chapeus' },
        { label: 'Mochilas & Bolsas', route: '/lacoste/acessorios/mochilas&bolsas' }
      ],

      
      novidadesHugo:[
        { label: 'Novidades', route: '/lacoste/novidades' },
        { label: 'Vestuário', route: '/lacoste/vestuario' },
        { label: 'Calçados', route: '/lacoste/calcados' },
        { label: 'Acessórios', route: '/lacoste/acessorios' }
      ],
      vestuarioHugo:[
        { label: 'Polos', route: '/lacoste/vestuario/polos' },
        { label: 'Camisetas', route: '/lacoste/vestuario/camisetas' },
        { label: 'Suéteres & Moletons', route: '/lacoste/vestuario/sueteres&moletom' },
        { label: 'Calças & Bermudas', route: '/lacoste/vestuario/calcas&bermudas' },
      ],
      calcadosHugo: [
        { label: 'Chinelos', route: '/lacoste/calcados/chinelos' }
      ],
      acessoriosHugo: [
        { label: 'Bonés & Chapeus', route: '/lacoste/acessorios/bones' },
      ]

    };
  },
  computed: {
    gruposCategorias() {
      return [
        { nome: 'Novidades', itens: this.novidades },
        { nome: 'Vestuário', itens: this.vestuario },
        { nome: 'Calçados', itens: this.calcados },
        { nome: 'Acessórios', itens: this.acessorios }
      ];
    }
  },
  methods: {
    navegarPara(route, index) {
      this.tab = index;
      this.$router.push(route);
    },
    navegarParaSecundario(route) {
      this.$router.push(route);
    }
  }
};
</script>
<style scoped>
.search-bar {
  max-width: 400px;
  width: 100%;
}
</style>
