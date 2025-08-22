<template>
  <v-row>
    <v-col
      variant="outlined"
      cols="6"
      md="3"
      v-for="(pacote, pacoteIdx) in portfolios"
      :key="pacote._id"
    >
        <!-- Skeleton Loader para imagens -->
        <v-skeleton-loader
          v-if="!imagensCarregadas[pacoteIdx]"
          type="image"
        ></v-skeleton-loader>
        <!-- Carrossel de imagens -->
        <v-carousel
          v-else
          cycle
          variant="outlined"
          :continuous="true"
          :show-arrows="false"
          delimiter-icon="mdi-square"

        >
          <v-carousel-item
            v-for="(img, idx) in pacote.imagensServicos || []"
            :key="idx"
            variant="outlined"
          >

          <v-img
                :src="obterUrlImagem(img)"
                  variant="outlined"
                :alt="`Imagem ${idx + 1}`"
                class="carousel-image"
                @click="abrirImagem(pacoteIdx, idx)"
            ></v-img>
          </v-carousel-item>
        </v-carousel>

    </v-col>

    <!-- Diálogo para exibir imagens ampliadas -->
    <v-dialog v-model="dialogImagem" max-width="700px">
      <v-carousel
        v-if="imagensDialog.length"
        v-model="currentImage"

        delimiter-icon="mdi-square"

      >
        <v-carousel-item
          v-for="(img, idx) in imagensDialog"
          :key="idx"
        >
        <v-img :src="img"></v-img>
         
        </v-carousel-item>
      </v-carousel>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const portfolios = ref([]);
    const dialogImagem = ref(false);
    const currentImage = ref(0);
    const imagensDialog = ref([]);
    const imagensCarregadas = ref([]);

    const carregarPortfolios = async () => {
      try {
        const response = await axios.get(
          "https://prev-construtora-bff6fa01a3b5.herokuapp.com/portfolios"
        );
        console.log("Dados carregados:", response.data); // Verifique se os dados são carregados corretamente
        portfolios.value = response.data.map((portfolio) => ({
          ...portfolio,
        }));

        // Inicializa o estado de carregamento das imagens
        imagensCarregadas.value = portfolios.value.map(() => false);

        // Pré-carregar imagens
        preCarregarImagens();
      } catch (error) {
        console.error("Erro ao carregar portfolios:", error.message);
      }
    };

    const obterUrlImagem = (img) => {
      if (typeof img === "string" && img.startsWith("https://")) {
        return img;
      }
      // Caso a imagem não seja uma URL completa, construímos a URL base
      return img
        ? `https://para-construcoes.s3.us-west-2.amazonaws.com/${img}`
        : "";
    };

    const abrirImagem = (pacoteIdx, imgIdx) => {
      const portfolio = portfolios.value[pacoteIdx];
      imagensDialog.value = portfolio.imagensServicos.map((img) => {
        console.log("Imagem:", img); // Adicione este log
        return obterUrlImagem(img);
      });
      currentImage.value = imgIdx;
      dialogImagem.value = true;
    };

    const fecharDialogImagem = () => {
      dialogImagem.value = false;
      imagensDialog.value = [];
      currentImage.value = 0;
    };

    const preCarregarImagens = () => {
      portfolios.value.forEach((portfolio, index) => {
        Promise.all(
          (portfolio.imagensServicos || []).map((img) => {
            return new Promise((resolve) => {
              const imgElement = new Image();
              imgElement.src = obterUrlImagem(img);
              imgElement.onload = resolve;
            });
          })
        ).then(() => {
          imagensCarregadas.value[index] = true;
        });
      });
    };

    onMounted(() => {
      carregarPortfolios();
    });

    return {
      portfolios,
      dialogImagem,
      currentImage,
      imagensDialog,
      imagensCarregadas,
      carregarPortfolios,
      obterUrlImagem,
      abrirImagem,
      fecharDialogImagem,
  
    };
  },
};
</script>

<style scoped>


@media (max-width: 300px) {

}
</style>
