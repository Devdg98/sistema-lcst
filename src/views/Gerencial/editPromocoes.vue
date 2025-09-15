<template>
    <v-container class="pa-2 mt-n6">


    

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