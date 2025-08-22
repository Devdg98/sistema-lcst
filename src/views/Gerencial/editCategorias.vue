<template>
    <v-container class="pa-2 mt-n6">
      <v-card-title class="tituloCategoria mt-n4 mb-4">CATEGORIA LACOSTE</v-card-title>
<v-slide-group
>
  <v-slide-group-item
    v-for="(categoria, i) in categorias"
    :key="i"
  >
    <router-link :to="categoria.rota" class="categoria-link">
  <div class="categoria-card pa-2 mb-4">
    <v-img :src="categoria.img" class="pa-2" cover></v-img>
    <v-card-subtitle class="text-start subtituloCategoria mt-2">
      {{ categoria.nome }}
    </v-card-subtitle>
  </div>
</router-link>

  </v-slide-group-item>
</v-slide-group>
    
<v-card-title class="tituloCategoria mt-n2">CATEGORIAS HUGOBOSS</v-card-title>
<v-slide-group
>
  <v-slide-group-item
    v-for="(categoria, i) in categoriasHugo"
    :key="i"
  >
    <router-link :to="categoria.rota">
  <div class="categoria-card pa-2">
    <v-img :src="categoria.img" cover class="position-relative" height="200">
      <!-- Subtítulo sobreposto na parte inferior da imagem -->
      <div class="subtitulo-overlay">
        <v-card-subtitle class="text-start subtituloCategoriaHugo">{{ categoria.nome }}</v-card-subtitle>
      </div>
    </v-img>
  </div>
</router-link>

  </v-slide-group-item>
</v-slide-group>

    

    <div class="pa-2" v-for="(sale, i) in salles" :key="i">
  <router-link :to="sale.rota">
    <v-img :src="sale.img" cover class="position-relative rounded-0" height="400">
      
      <!-- Overlay na parte inferior -->
      <div class="sale-overlay d-flex flex-column align-center justify-end text-center px-4 pb-4">
        <h3 class="sale-title">{{ sale.titulo }}</h3>
        <p class="sale-subtitle">{{ sale.subtitulo }}</p>
        <v-btn
          icon
          variant="outlined"
          color="white"
          size="small"
          class="mt-2 sale-btn"
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </div>

    </v-img>
  </router-link>
</div>

    </v-container>

</template>

<script setup>

const categorias = [
  { nome: 'Moletons', img: 'https://images-offstore.map.azionedge.net/compressed/9b7b14433e249066090e2202ad676d94.webp', rota: '/lacoste/vestuario/sueters&moletom' },
  { nome: 'Calçados', img: 'https://images-offstore.map.azionedge.net/compressed/dd735eb49f929cf02989fa83fd8200f3.webp', rota: '/lacoste/calcados' },
  { nome: 'Polos', img: 'https://images-offstore.map.azionedge.net/compressed/18ffac80f18c743e7153b9ab48a4019c.webp', rota: '/lacoste/vestuario/polos' },
  { nome: 'Boné', img: 'https://images-offstore.map.azionedge.net/compressed/2726de10a6ac0c8c7325a05700519a9a.webp', rota: '/lacoste/acessorios/bones&chapeus' },
  { nome: 'Camisetas', img: 'https://images-offstore.map.azionedge.net/compressed/6cd018b44b9787033cbfdae48f38765e.webp', rota: '/lacoste/vestuario/camisetas'},
  { nome: 'Shorts', img: 'https://images-offstore.map.azionedge.net/compressed/5d370566607eae91654357fe735067ba.webp', rota: '/lacoste/vestuario/calcas&bermudas' },
]
const categoriasHugo = [
  { nome: 'Moletons', img: 'https://images-offstore.map.azionedge.net/compressed/4d5172658bb991ebda7cb42b2071cbb7.webp', rota: '/hugo/moletons' },
  { nome: 'Calçados', img: 'https://images-offstore.map.azionedge.net/compressed/d18548467311a8ffd5acf7fa701ab550.webp', rota: '/hugo/calcados' },
  { nome: 'Polos', img: 'https://images-offstore.map.azionedge.net/compressed/29846eb00348ba9dd1c3f1b43d4b133e.webp', rota: '/hugo/polos' },
  { nome: 'Boné', img: 'https://images-offstore.map.azionedge.net/compressed/7952e08fb653e4da305d86f71de4e924.webp', rota: '/hugo/bones&chapeus' },
  { nome: 'Camisetas', img: 'https://images-offstore.map.azionedge.net/compressed/ce69c9f99af9aef780fed29ba8ebca5e.webp', rota: '/hugo/camisetas&regatas'},
  { nome: 'Shorts', img: 'https://images-offstore.map.azionedge.net/compressed/ce5eee7f2cadb9c62409aa2e611ee77b.webp', rota: '/hugo/shorts&bermudas' },
]

const salles = [
  {
    img: 'https://images-offstore.map.azionedge.net/compressed/137b9689258c68981475c865663d6e7f.webp',
    rota: '/lacoste/vendidos',
    titulo: 'DESTAQUES',
    subtitulo: 'Confira seleção mais vendida'
  },
  {
    img: 'https://images-offstore.map.azionedge.net/compressed/6ef7b5c5531033c2e3fc7209bbe9291c.webp',
    rota: '/lacoste/acessorios21',
    titulo: 'ACESSÓRIOS',
    subtitulo: 'Óculos, bolsas e mais'
  }
];

</script>

<style scoped>
.categoria-card {
  width: 300px;
  height: 450px;
  display: flex;
  flex-direction: column;
  
}
.tituloCategoria{
  font-size: 26px;
  font-weight: 400;
}
.subtituloCategoria{
  font-size: 18px;
  font-weight: 400;
  color: #002D18;
}
.categoria-link {
  text-decoration: underline;
  text-decoration-color: #002D18;
}
.subtitulo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.616); /* fundo escuro semi-transparente */
  padding: 12px;
 
}
.subtituloCategoriaHugo {
  font-size: 18px;
  color: #fff !important; /* branco puro */
  font-weight: 500;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.2); /* leve brilho se quiser melhorar contraste */
  opacity: 1 !important;
}
.sale-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.616); /* fundo escuro semi-transparente */
  padding: 12px;
}

.sale-title {
  color: #fff;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0;
}

.sale-subtitle {
  color: #eee;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.sale-btn {
  border-radius: 0 !important; /* botão quadrado */
  border-color: white !important;
}

</style>
