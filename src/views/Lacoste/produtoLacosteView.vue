<template>
  <v-defaults-provider :defaults="{ VBtn: { variant: 'outlined', color: '#002D18', class: 'rounded-0' } }">
      <v-carousel
        v-if="produto?.imagensProdutos?.length"
        v-model="currentIndex"
        direction="vertical"
        height="600"
        progress="#002D18"
        vertical-delimiters="right"
        hide-delimiter-background
        hide-delimiters
        show-arrows="never"
        class="carousel-fixo rounded-0"
      >
        <v-carousel-item
          v-for="(img, i) in produto.imagensProdutos"
          :key="i"
          :src="img"
          cover
        />
      </v-carousel>
    </v-defaults-provider>

    <!-- Conteúdo que rola por cima -->
    <div class="conteudo-scroll">
      <div class="pa-6">
        <div class="d-flex justify-space-between align-start flex-wrap">
          <!-- Descrição -->
          <h2 class="titulo mr-2" style="max-width: 70%">
            {{ produto.descricaoProduto }}
          </h2>

          <!-- Preço principal -->
          <div class="text-right textosCard">
            <span>{{ formatarPreco(produto.valorProduto) }}</span>
            <div class="text-desconto">
               {{ formatarPreco(produto.valorDesconto) || '0,00' }}
            </div>
          </div>
        </div>

        <div class="subtituloCard">
          {{ produto.categoriaProduto || 'Categoria não informada' }} -
          {{ produto.corProduto || 'Cor não informada' }} -
          {{ produto.marcaProduto || 'Marca não informada' }}
        </div>

        <v-chip
          v-if="produto.desconto"
         
          text-color="white"
          class="mb-3 "
          label
          small
        >
          {{ produto.desconto }}% DE DESCONTO
        </v-chip>

        <v-divider class="mb-3"></v-divider>

        <!-- Seleção de Cor -->
        <div class="d-flex align-center justify-space-between mb-3 link-cor">
          <div class="d-flex align-center">
            <v-avatar size="50" class="mr-2" color="grey-lighten-3" rounded="lg">
  <v-img v-if="produto.imagensProdutos[0]" :src="produto.imagensProdutos[0]" />
</v-avatar>

            <div>
              <div>
                {{ produto.corProduto || 'Cor não informada' }}
              </div>
              <div
              
                style="cursor: pointer"
                @click="showBottomSheet = true"
              >
                Selecione a Cor: {{ produto.coresSelecionadas?.length }}
              </div>
            </div>
          </div>
          <v-btn icon="mdi-chevron-right" size="small" variant="text" @click="showBottomSheet = true" />
        </div>

        <v-divider class="mb-3"></v-divider>

        <!-- Seleção de Tamanho -->
        <div class="d-flex align-center justify-space-between mb-3">
          <span class="link-tamanho">Selecione o tamanho:</span>
          <v-btn icon="mdi-chevron-right" size="small" variant="text" @click="showBottomSheet2 = true" />
        </div>

        <v-divider class="mb-3"></v-divider>

        <!-- Frete grátis -->
        <div class="mt-4 d-flex align-center link-frete">
          <v-icon size="18" class="mr-1">mdi-truck-delivery-outline</v-icon>
          Frete Grátis para todo o Brasil
        </div>

        <v-divider class="mt-3"></v-divider>

        <!-- Adicionar à sacola -->
        
        <v-toolbar
  dense
  flat
  color="#002D18"
  class="d-flex justify-space-between rounded-0"
  style="position: fixed; bottom: 0; left: 0; width: 100%; z-index: 1000;"
>
  <v-btn
    block
    class="ma-2 addSacola rounded-0"
    @click="showBottomSheet3 = true"
  >
    ADICIONAR À SACOLA
  </v-btn>
</v-toolbar>

      </div>
    </div>

        <v-bottom-sheet v-model="showBottomSheet" fullscreen class="rounded-0">
          <v-toolbar dense flat color="#002D18" class="d-flex justify-space-between rounded-0">
            <v-toolbar-title class="text-white">Selecionar Cor</v-toolbar-title>
            <v-btn icon @click="showBottomSheet = false" class="rounded-0">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-container fluid class="bg-white overflow-y-auto rounded-0" style="max-height: calc(100vh - 56px);">
            <v-row class="pa-4">
              <v-col cols="12">
                <v-card-title class="pa-0 mb-2">Escolha uma Cor</v-card-title>
              </v-col>
              <v-col
  class="pa-1"
  v-for="cor in produto.coresSelecionadas"
  :key="`cor-${cor}`"
  cols="6"
  sm="4"
  md="3"
>
  <v-card
    class="rounded-0 pa-0"
    :elevation="model === cor ? 4 : 1"
    @click="selectCor(cor)"
  >
    <!-- Barra superior colorida -->
    <div
      :style="{ backgroundColor: cor.toLowerCase(), height: '8px' }"
    ></div>

    <!-- Conteúdo central -->
    <div
      class="d-flex justify-center align-center"
      style="height: 80px"
    >
      <span
        class="text-body-2 font-weight-medium"
        :class="model === cor ? 'text-green-darken-3' : 'text-grey-darken-1'"
      >
        {{ cor }}
      </span>
      <v-icon
        v-if="model === cor"
        color="green-darken-3"
        icon="mdi-check-circle-outline"
        class="ml-2"
      />
    </div>
  </v-card>
</v-col>

            </v-row>
          </v-container>
        </v-bottom-sheet>

        <v-bottom-sheet v-model="showBottomSheet2" fullscreen class="rounded-0">
          <v-toolbar dense flat color="#002D18" class="d-flex justify-space-between rounded-0">
            <v-toolbar-title class="text-white">Selecionar Tamanho</v-toolbar-title>
            <v-btn icon @click="showBottomSheet2 = false" class="rounded-0">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-container fluid class="bg-white overflow-y-auto rounded-0" style="max-height: calc(100vh - 56px);">
            <v-row class="pa-4">
              <v-col cols="12">
                <v-card-title class="pa-0 mb-2">Escolha um Tamanho</v-card-title>
              </v-col>

              <v-col
                class="pa-1"
                v-for="tamanho in produto.tamanhosSelecionados"
                :key="tamanho"
                cols="4"
                sm="3"
                md="2"
              >
                 <v-card
        class="rounded-0 pa-0"
        :elevation="modelTamanho === tamanho ? 4 : 1"
        @click="selectTamanho(tamanho)"
      >
        <!-- Conteúdo central -->
        <div
          class="d-flex justify-center align-center"
          style="height: 60px"
        >
          <span
            class="text-body-2 font-weight-medium"
            :class="modelTamanho === tamanho ? 'text-green-darken-3' : 'text-grey-darken-1'"
          >
            {{ tamanho }}
          </span>
          <v-icon
            v-if="modelTamanho === tamanho"
            color="green-darken-3"
            icon="mdi-check-circle-outline"
            class="ml-1"
          />
        </div>
      </v-card>
              </v-col>
            </v-row>
            <div class="pa-12">
              <v-btn block class="mt-4 rounded-0" color="#002D18" @click="showBottomSheet3 = true; showBottomSheet2 = false">Adicionar à Sacola</v-btn>
            </div>
          </v-container>
        </v-bottom-sheet>

         <v-bottom-sheet v-model="showBottomSheet3" fullscreen class="rounded-0">
          <v-toolbar dense flat color="#002D18" class="d-flex justify-space-between rounded-0">
            <v-toolbar-title class="text-white">Artigo Selecionado no Carrinho</v-toolbar-title>
            <v-btn icon @click="showBottomSheet3 = false" class="rounded-0">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-container fluid
          class="bg-white overflow-y-auto"
          style="height: calc(100vh - 56px);">
            <v-row class="pa-4">
              <v-col cols="12" md="6">
                <v-defaults-provider :defaults="{ VBtn: { variant: 'outlined', color: '#002D18', class: 'rounded-0' } }">
  <v-carousel
    v-if="produto && produto.imagensProdutos && produto.imagensProdutos.length"
    v-model="currentIndex"
    direction="vertical"
    height="400"
    progress="#002D18"
    vertical-delimiters="right"
    hide-delimiter-background
    hide-delimiters
    show-arrows="never"
    class="rounded-0"
  >
    <v-carousel-item
      v-for="(img, i) in produto.imagensProdutos"
      :key="i"
      :src="img" 
      cover
    ></v-carousel-item>
  </v-carousel>
</v-defaults-provider>

              </v-col>
              <v-col cols="12" md="6">
                <v-card-title class="titulo">
  {{ produto.descricaoProduto }}
</v-card-title>
<v-card-subtitle class="subtituloValor">
  Preço: <span>R$ {{ produto.valorProduto }}</span>
</v-card-subtitle>
<v-card-text class="textosCard">
  <div>
    <strong>Categoria:</strong> {{ produto.categoriaProduto || 'Não informado' }}
  </div>
  <div>
    <strong>Cor:</strong> {{ produto.corProduto || 'Não informada' }}
  </div>
  <div>
    <strong>Marca:</strong> {{ produto.marcaProduto || 'Não informada' }}
  </div>
</v-card-text>
              </v-col>
            </v-row>

            <div class="pa-2 ">
              <v-btn block class="pa-4 rounded-0 addSacola">Mostrar Carrinho de Compras</v-btn>
            </div>
            <div class="pa-2">
              <v-btn block class="pa-4 rounded-0 addSacola">Continuar Comprando</v-btn>
            </div>
          </v-container>
        </v-bottom-sheet>
</template>

<script setup>
import { ref, onMounted, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProdutosLacoste } from '@/store/produtosLacoste';

const route = useRoute();
const produtosStore = useProdutosLacoste();
const { produtos } = storeToRefs(produtosStore);
const { carregarProdutos } = produtosStore;
const showBottomSheet = ref(false);
const showBottomSheet2 = ref(false);
const showBottomSheet3 = ref(false);
const currentIndex = shallowRef(0);

const produto = ref({
  descricaoProduto: '',
  valorProduto: '',
  categoriaProduto: '',
  corProduto: '',
  marcaProduto: '',
  coresSelecionadas: [],
  tamanhosSelecionados: [],
  imagensProdutos: [],
});

const model = ref(null);
const modelTamanho = ref(null);

const selectCor = (cor) => {
  model.value = cor === model.value ? null : cor;
};

const selectTamanho = (tamanho) => {
  modelTamanho.value = tamanho === modelTamanho.value ? null : tamanho;
};


const buscarProdutoPorSlug = (slug) => {
  // Acessa a lista de produtos da store
  return produtos.value.find((p) => {
    // Cria um slug a partir da descrição do produto para comparação
    const produtoSlug = p.descricaoProduto
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
    return produtoSlug === slug;
  });
};

const carregarProdutoPorRota = () => {
  const slug = route.params.slug;
  const resultado = buscarProdutoPorSlug(slug);

  // Atualiza a variável reativa com o produto encontrado ou um objeto padrão
  produto.value = resultado || {
    descricaoProduto: 'Produto não encontrado',
    valorProduto: '',
    categoriaProduto: '',
    corProduto: '',
    marcaProduto: '',
    imagensProdutos: [],
    tamanhosSelecionados: [],
    coresSelecionadas: [],
  };
};

onMounted(async () => {
   if (produtos.value.length === 0) {
    await carregarProdutos();
  }
  carregarProdutoPorRota();
  if (produtos.value.length === 0) await carregarProdutos();
  const slug = route.params.slug;
  const resultado = buscarProdutoPorSlug(slug);
  produto.value = resultado || {
    descricaoProduto: 'Produto não encontrado',
    valorProduto: '',
    categoriaProduto: '',
    corProduto: '',
    marcaProduto: '',
    imagensProdutos: [],
    tamanhosSelecionados: [],
    coresSelecionadas: [],
  };
});
watch(() => route.params.slug, (novoSlug, antigoSlug) => {
  if (novoSlug && novoSlug !== antigoSlug) {
    carregarProdutoPorRota();
  }
});
const formatarPreco = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
</script>

<style scoped>
.titulo {
  font-size: 16px;
  color: #002D18;
  font-weight: 400;
  text-transform: uppercase;
  line-height: 1.3;
  word-break: break-word; /* quebra palavras longas */
  white-space: normal;    /* permite quebras de linha */
}


.detalhes-produto-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.carousel-fixo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  
}

.conteudo-scroll {
  position: relative;
  z-index: 2;
  margin-top: 400px;
  height: calc(100vh - 400px);
  overflow-y: auto;
  background-color: white;

  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
}
.textosCard {
  color: #0d3b15;
  font-weight: 500;
  font-size: 16px;
 
}
.subtituloCard {
  font-size: 12px;
  color: #252525;
  font-weight: 300;
}
.subtituloValor {
  font-size: 16px;
  color: #252525;
  font-weight: 400;
}
.link-tamanho {
  font-size: 16px;
  text-decoration: none; /* Remove o sublinhado por padrão */
  color: inherit; /* Garante que a cor seja herdada de .textosCard, se desejar */
  transition: text-decoration 0.2s ease; /* Adiciona uma transição suave para o sublinhado */
}
/* Regra para aplicar o sublinhado APENAS ao passar o mouse */
.link-tamanho:hover {
  text-decoration: underline; /* Adiciona o sublinhado ao passar o mouse */
}
.link-frete {
  font-size: 14px;
  text-decoration: none; /* Remove o sublinhado por padrão */
  color: inherit; /* Garante que a cor seja herdada de .textosCard, se desejar */
  transition: text-decoration 0.2s ease; /* Adiciona uma transição suave para o sublinhado */
}
/* Regra para aplicar o sublinhado APENAS ao passar o mouse */
.link-frete:hover {
  text-decoration: underline; /* Adiciona o sublinhado ao passar o mouse */
}
.link-cor {
  font-size: 16px;
  text-decoration: none; /* Remove o sublinhado por padrão */
  color: inherit; /* Garante que a cor seja herdada de .textosCard, se desejar */
  transition: text-decoration 0.2s ease; /* Adiciona uma transição suave para o sublinhado */
}
/* Regra para aplicar o sublinhado APENAS ao passar o mouse */
.link-cor:hover {
  text-decoration: underline; /* Adiciona o sublinhado ao passar o mouse */
}
.addSacola{
  background-color: #002D18 !important;
  color: white !important;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.text-desconto {
  text-decoration: line-through;
  font-weight: 300;
  font-size: 14px;
}
</style>