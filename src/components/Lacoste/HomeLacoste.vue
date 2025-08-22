<template>
<div
  class="pa-0 banner-card mt-n4"
  v-for="(banner, i) in banners"
  :key="i"
  @click="$router.push(banner.rota)"
  style="cursor: pointer;"
>
  <v-img :src="banner.img" class="banner-img" cover></v-img>
</div>

    <v-card-title class="titulo">CATEGORIAS LACOSTE</v-card-title>
    <v-slide-group
  class="categoria-slider"
  show-arrows
  center-active
>
  <v-slide-group-item
    v-for="(categoria, i) in categorias"
    :key="i"
  >
    <router-link :to="categoria.rota" class="categoria-link">
      <div class="pa-4 categoria-card">
        <v-img :src="categoria.img" class="categoria-img" cover></v-img>
        <v-card-title class="text-start">{{ categoria.nome }}</v-card-title>
      </div>
    </router-link>
  </v-slide-group-item>
</v-slide-group>



    <v-row>
      <v-col cols="6">
        <div class="pa-n2 esportivo-card" v-for="(esportivo, i) in esportivos" :key="i">
          <v-img :src="esportivo.img" class="esportivo-img" cover></v-img>
          
        </div>
      </v-col>
      <v-col cols="6" class="d-flex align-center justify-center">
    <div class="pa-4 bg-white">
        <v-card-subtitle>GRAND SLAN</v-card-subtitle>
        <v-card-title>Roland Garros</v-card-title>
        <v-card-text>Confira os looks esportivos!</v-card-text>
        <v-card-actions>
            <v-btn>COMPRAR</v-btn>
        </v-card-actions>
    </div>
</v-col>
    </v-row>
    <div class="d-flex justify-center">
    <div class="pa-4 salles-card" v-for="(sale, i) in salles" :key="i">
        <router-link :to="sale.rota" class="salles-link">
        <v-img :src="sale.img" class="salles-img" cover>
          <div class="salles-overlay d-flex flex-column justify-end pa-4">
            <h3 class="salles-titulo">{{ sale.titulo }}</h3>
            <p class="salles-subtitulo">{{ sale.subtitulo }}</p>
            <v-btn
              icon
              variant="outlined"
              color="white"
              size="small"
              class="mt-2"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-img>
        
      </router-link>
    </div>
</div>

</template>

<script setup>
const banners =[
  { img: require('@/assets/lancamento.png'), rota: '/lacoste/vendidos' },
]
const categorias = [
  { nome: 'Moletons', img: require('@/assets/moletons.png'), rota: '/lacoste/vestuario/sueters&moletom' },
  { nome: 'Calçados', img: require('@/assets/calcados.png'), rota: '/lacoste/calcados' },
  { nome: 'Polos', img: require('@/assets/polos.png'), rota: '/lacoste/vestuario/polos' },
  { nome: 'Bonés', img: require('@/assets/bones.png'), rota: '/lacoste/acessorios/bones&chapeus' },
  { nome: 'Camisetas', img: require('@/assets/camisetas.png'), rota: '/lacoste/vestuario/camisetas'},
  { nome: 'Calças', img: require('@/assets/calcas.png'), rota: '/lacoste/vestuario/calcas&bermudas' },
]
const esportivos = [
  { img: require('@/assets/modelo.png') },
]
const salles = [
  {
    img: require('@/assets/vendidos.png'),
    rota: '/lacoste/vendidos',
    titulo: 'DESTAQUES',
    subtitulo: 'Confira seleção de mais vendidos lacoste'
  },
  {
    img: require('@/assets/acessorios.png'),
    rota: '/lacoste/acessorios21',
    titulo: 'ACESSÓRIOS',
    subtitulo: 'Óculos, bolsas e mais'
  }
];

</script>

<style scoped>
.titulo {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 16px;
  font-family: 'Poppins', sans-serif; /* Ou outra moderna */
  text-align: left;
  color: #1a1a1a;
}
.esportivo-card {
  width: 900px;
  height: 800px;
  display: flex;
  flex-direction: column;
}

.esportivo-img {
  width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  object-fit: cover;
}

.salles-card {
  width: 900px;
  height: 1000px;
  display: flex;
  flex-direction: column;
}

.salles-img {
  width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  object-fit: cover;
}
.salles-card {
  width: 100%;
  max-width: 600px;
  position: relative;
}
.salles-link {
  text-decoration: none;
  display: block;
  color: white;
}
.salles-img {
  height: 500px;
  border-radius: 0;
}
.salles-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
}
.salles-titulo {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}
.salles-subtitulo {
  font-size: 16px;
  margin: 4px 0 0;
  font-weight: 300;
}

.categoria-card {
  width: 450px;
  height: 900px;
  display: flex;
  flex-direction: column;
}

.categoria-img {
  width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  object-fit: cover;
}
.banner-card{
  width: 100%;
  height: 650px;
  display: flex;
}
.banner-img{
  width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  object-fit: cover;
}

</style>
