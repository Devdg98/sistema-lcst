<template>

      <div class="breadcrumbs-scroll mt-n8">
    <v-breadcrumbs rumbs :items="items" class="beadcrumbs" divider="" />
  </div>
    <h2 class="titulo font-weight-regular text-center mb-2 ">CAMISETAS LACOSTE</h2>
   <v-toolbar class="toolbar" flat color="white">
      <v-bottom-sheet v-model="filtrosAtivos">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" class="btn-filtros" rounded="0" dark>
            <v-icon start>mdi-filter-variant</v-icon>
            FILTROS
          </v-btn>
          <v-btn v-bind="activatorProps" class="btn-opcoes" rounded="0">
            COR
          </v-btn>
          <v-btn v-bind="activatorProps" class="btn-opcoes" rounded="0">
            TAMANHO
          </v-btn>
        </template>

        <v-sheet class="pa-0 rounded-0" elevation="0">
          <v-toolbar class="mt-2 bg-white d-flex justify-space-between align-center">
            <v-toolbar-title class="tituloFiltro">
              FILTROS E SEPARADORES
            </v-toolbar-title>
            <v-btn
              icon="mdi-close"
              variant="text"
             color="#002D18"
              @click="closeFilter"
              rounded="0"
            ></v-btn>
          </v-toolbar>

          <div class="mb-4 pa-2">
            <v-card-subtitle class="subtituloFiltro mt-2">
              CLASSIFICAR POR
            </v-card-subtitle>
            
           <v-radio-group class="classificaFiltro radio-right-icon pa-4" v-model="sortOption" color="green-darken-4" hide-details>
            <v-radio label="Nossa seleção" value="nossa-selecao" class="pa-0 mt-n2"></v-radio>
            <v-radio label="Menor preço" value="menor-preco" class="pa-0 mt-n2"></v-radio>
            <v-radio label="Maior preço" value="maior-preco" class="pa-0 mt-n2"></v-radio>
            <v-radio label="Mais vendidos" value="mais-vendidos" class="pa-0 mt-n2"></v-radio>
          </v-radio-group>
    
           
            <v-card-subtitle class="subtituloFiltro mt-4">
              FILTRAR POR
            </v-card-subtitle>
            <v-expansion-panels variant="accordion" class="mt-6">
               
              <v-expansion-panel title="Cores" rounded="0" elevation="0" class="tituloExp mt-2 no-border-panel" >
                <v-expansion-panel-text>
                  <v-row>
                    <v-col
                      class="pa-0"
                      v-for="cor in cores"
                      :key="`cor-${cor}`"
                      cols="4"
                      sm="4"
                      md="4"
                      elevation="0"
                    >
                      <v-card
                        width="116"
                        height="50"
                        class="rounded-0 pa-0 border"
                        :elevation="model === cor ? 4 : 1"
                        @click="selectCor(cor)"
                      >
                        <div
                          :style="{ backgroundColor: cor.toLowerCase(), height: '8px' }"
                        ></div>
                        <div class="d-flex justify-center align-center" style="height: 100%">
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
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel title="Tamanho" rounded="0"  elevation="0" class="tituloExp mt-4 no-border-panel">
                <v-expansion-panel-text class="mt-4">
                  <v-row>
                    <v-col
                      class="pa-0"
                      v-for="tamanho in tamanhos"
                      :key="tamanho"
                      cols="4"
                      sm="4"
                      md="4"
                    elevation="0"
                    >
                      <v-card
                        width="116"
                        height="50"
                        class="rounded-0 pa-0 border"
                        :elevation="modelTamanho === tamanho ? 4 : 1"
                        @click="selectTamanho(tamanho)"
                      >
                        <div class="d-flex justify-center align-center" style="height: 60px">
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
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <v-toolbar>
        <v-toolbar
  dense
  flat
  color="blue-grey-lighten-5"
  class="d-flex justify-space-between align-center"
  style="position: fixed; bottom: 0; left: 0; width: 100%; z-index: 1000;"
>

 <v-btn
              v-if="model || modelTamanho"
              variant="text"
              color="#002D18"
              class="limparFiltro mb-2 rounded-0"
              @click="limparFiltros"
            >
              Limpar tudo
            </v-btn>
<v-spacer></v-spacer>
  <v-btn
    variant="outlined"
    class="ma-2 rounded-0 addSacola"
    @click="verProdutos"
  >
    VER PRODUTOS
  </v-btn>
</v-toolbar>
          
        </v-toolbar>
        </v-sheet>
        
      </v-bottom-sheet>
           </v-toolbar>
        
   <v-container>
     <v-row class="pa-0">
      <v-col
        cols="6"
        v-for="(produto, idx) in produtosFiltrados"
        :key="produto._id"
        class="pa-1 border"
      >
          <v-carousel
            cycle
            :height="240"
            :show-arrows="false"
            hide-delimiters
            class="carousel-portfolio rounded-0"
          >
            <v-carousel-item v-for="(img, imgIdx) in produto.imagensProdutos" :key="imgIdx">
              <v-img
                :src="obterUrlImagem(img)"
                class="carousel-image rounded-0"
                :alt="`Imagem ${imgIdx + 1} de ${produto.descricaoProduto}`"
                cover
                @click="abrirImagem(idx, imgIdx)"
              />
            </v-carousel-item>
          </v-carousel>
          <v-card-text class="textosCard">
            <div>
              <div>
  <span>
    {{ formatarPreco(produto.valorProduto) }}
  </span>

  <span v-if="produto.valorDesconto" class="text-decoration-line-through">
    {{ formatarPreco(produto.valorDesconto) }}
  </span>
</div>

            <router-link
              :to="gerarLink(produto.descricaoProduto)"
              class="link-produto "
            >
              {{ produto.descricaoProduto || 'Sem descrição' }}
            </router-link>
            </div>
          </v-card-text>
      </v-col>
    </v-row>
   </v-container>

    <v-dialog v-model="dialogEdicao" max-width="800px" transition="dialog-bottom-transition">
      <v-card rounded="0">
        <v-toolbar color="grey-darken-3" dark flat rounded="0">
          <v-toolbar-title class="text-white">Edição do Produto</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="fecharDialogEdicao" rounded="0">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="produtoEditando.marcaProduto"
                  label="Marca do Produto"
                  required
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="produtoEditando.categoriaProduto"
                  :items="categorias"
                  label="Categoria"
                  required
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="produtoEditando.descricaoProduto"
                  label="Descrição"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6" sm="3">
                <v-select
                  v-model="produtoEditando.tamanhosSelecionados"
                  :items="tamanhos"
                  label="Tamanhos"
                  multiple
                  clearable
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6" sm="3">
                <v-select
                  v-model="produtoEditando.coresSelecionadas"
                  :items="cores"
                  label="Cor"
                  clearable
                  variant="outlined"
                  density="compact"
                  multiple
                />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field
                  v-model="produtoEditando.generoProduto"
                  label="Gênero"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field
                  v-model="produtoEditando.estoqueProduto"
                  label="Estoque"
                  type="number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="produtoEditando.valorProduto"
                  label="Valor"
                  prefix="R$"
                  type="number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="produtoEditando.valorDesconto"
                  label="Desconto"
                  prefix="R$"
                  type="number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />
            <v-row align="center">
              <v-col cols="8">
                <v-text-field
                  v-model="novaImagemUrl"
                  label="Adicionar imagem por URL"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="4">
                <v-btn @click="adicionarImagemPorUrl" color="primary" block rounded="0">
                  Adicionar
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  multiple
                  accept="image/*"
                  label="Upload de Imagens"
                  @change="handleFileUpload"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>

            <draggable
              v-model="produtoEditando.imagensProdutos"
              item-key="element"
              class="d-flex flex-wrap"
            >
              <template #item="{ element, index }">
                <v-col cols="4" sm="3" md="2" class="pa-1">
                  <v-card class="pa-2 rounded-0" elevation="1">
                    <v-img :src="obterUrlImagem(element)" height="100" cover class="mb-2 rounded-0" />
                    <v-btn
                      color="red"
                      icon
                      @click="removerImagem(index)"
                      size="small"
                      class="rounded-0"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card>
                </v-col>
              </template>
            </draggable>
          </v-container>
        </v-card-text>

        <v-card-actions class="d-flex justify-end pa-4 bg-grey-lighten-4">
          <v-btn text @click="fecharDialogEdicao" rounded="0">Cancelar</v-btn>
          <v-btn
            color="green-darken-2"
            @click="salvarEdicao"
            :loading="catalogo.loading"
            rounded="0"
          >
            Salvar Alterações
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

   <v-bottom-sheet v-model="dialogImagem" fullscreen>
  <v-card  class="d-flex flex-column" style="height: 100vh; width: 100vw; overflow: hidden;">
    
    <!-- Cabeçalho fixo -->
     <v-toolbar class="bg-white pa-2">
 <v-card-title class="tituloVisualizacaoRapida">
      Visualização Rápida
     
    </v-card-title>
     <v-spacer></v-spacer>
      <v-btn icon @click="dialogImagem = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
     </v-toolbar>
   

    <!-- Conteúdo com scroll, incluindo o carousel -->
    <div style="overflow-y: auto; flex: 1 1 auto;">
      <!-- Carousel (parte do conteúdo scrollável) -->
      <div style="min-height: 400px;">
        <v-defaults-provider :defaults="{ VBtn: { variant: 'outlined', color: '#002D18', class: 'rounded-0' } }">
        <v-carousel
          v-model="currentImage"
          hide-delimiter-background
          show-arrows="never"
          :continuous="false"
          height="400px"
          direction="vertical"
          vertical-delimiters="right"
          hide-delimiters
          class="rounded-0"
          progress="#002D18"
        >
          <v-carousel-item
            v-for="(img, i) in imagensDialog"
            :key="i"
            :src="img"
            cover
          />
        </v-carousel>

        </v-defaults-provider>
        
      </div>

      <!-- Informações do produto -->
      <div class="px-4 pb-6">
        <h4 class="tituloVisualizacaoRapida mt-4">
          {{ currentProductDescription.descricaoProduto }}
        </h4>

        <div class="d-flex align-baseline mt-2 textosVisualizacaoRapida">
          <span class="product-price text-h5 font-weight-bold">
            {{ formatarPreco(currentProductDescription.valorProduto) }}
          </span>
          <span
            v-if="currentProductDescription.valorDesconto"
            class="product-old-price text-decoration-line-through ml-3"
          >
            {{ formatarPreco(currentProductDescription.valorDesconto) }}
          </span>
        </div>

        <!-- Cores -->
         
        <v-row class="mt-4">
          <v-col cols="12">
<v-card-subtitle class="subtituloCor">Todas as Cores(2)</v-card-subtitle>      </v-col>          
<v-col
  v-for="cor in currentProductDescription.coresSelecionadas || []"
  :key="cor"
  cols="6"
  sm="4"
  md="3"
>
  <v-card
    class="rounded-0 pa-1"
    :elevation="model === cor ? 4 : 1"
    @click="selectCor(cor)"
  >
    <div :style="{ backgroundColor: cor.toLowerCase(), height: '8px' }"></div>
    <div class="d-flex justify-center align-center" style="height: 80px">
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


<v-col cols="12">

<v-card-subtitle class="subtituloTamanho">Todas os Tamanhos</v-card-subtitle>
         </v-col>  
          <!-- Tamanhos -->
        <v-col
  v-for="tamanho in currentProductDescription.tamanhosSelecionados || []"
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
    <div class="d-flex justify-center align-center" style="height: 60px">
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
      </div>
    </div>
    
    <!-- Botão fixo ao final -->
    <v-card-actions class="px-4 pb-4">
        <!-- Botão que ativa o segundo bottom sheet (carrinho) -->
        <v-bottom-sheet v-model="dialogCarrinho" fullscreen>
          <template #activator="{ props: activatorProps }">
            <v-btn class="botaolacoste" block v-bind="activatorProps">
              Ir para Carrinho
            </v-btn>
          </template>

          <!-- Conteúdo do carrinho -->
          <v-card style="height: 100vh; width: 100vw;" class="d-flex flex-column">
  <!-- Topo com Título e Botão Fechar -->
  <v-toolbar flat>
    <v-toolbar-title class="text-h6">Carrinho</v-toolbar-title>
    <v-spacer />
    <v-btn icon @click="dialogCarrinho = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>

  <v-divider></v-divider>

  <!-- Conteúdo com Produto -->
  <v-card-text class="flex-grow-1 overflow-y-auto">
    <v-row no-gutters class="pa-4">
      <v-col cols="auto">
        <v-img
          :src="imagensDialog[0]"
          height="80"
          width="80"
          class="rounded"
          cover
        ></v-img>
      </v-col>

      <v-col class="pl-4 d-flex flex-column justify-center">
        <div class="descricaoTitulo">
          {{ currentProductDescription.descricaoProduto }}
        </div>
        <div class="CorTamanho mt-1">
          Cor: {{ model }} | Tamanho: {{ modelTamanho }}
        </div>
        <div class="textosProduto mt-1">
          {{ formatarPreco(currentProductDescription.valorProduto) }}
        </div>
      </v-col>
    </v-row>
  </v-card-text>


  <!-- Botões -->
  <v-card-actions class="d-flex flex-column pa-2 mt-n2">
    <v-btn block class="pa-4 rounded-0 botaolacoste">Mostrar Carrinho de Compras</v-btn>
    <v-btn block class="pa-4 rounded-0 botaolacoste">Continuar Comprando</v-btn>
  </v-card-actions>
</v-card>


          
        </v-bottom-sheet>
        
      </v-card-actions>
  </v-card>
   </v-bottom-sheet>



                                                   

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProdutosLacoste } from '@/store/produtosLacoste';
import draggable from 'vuedraggable';

const catalogo = useProdutosLacoste();
const dialogImagem = ref(false);
const imagensDialog = ref([]);
const currentImage = ref(0);
const imagensCarregadas = ref([]);
const dialogEdicao = ref(false);
const produtoEditando = ref(catalogo.getEstadoInicial());
const novaImagemUrl = ref('');
const filtrosAtivos = ref(false); // controla abertura do bottom sheet
const sortOption = ref('nossa-selecao'); // opção de ordenação
const dialogCarrinho = ref(false)
// NOVO: Ref para armazenar o produto completo que está sendo visualizado
const currentProductDescription = ref({});


// --- Filter/Sort Functions ---
const closeFilter = () => {
  filtrosAtivos.value = false;
};

const verProdutos = () => {
  console.log('Cor:', model.value, 'Tamanho:', modelTamanho.value, 'Ordem:', sortOption.value);
  filtrosAtivos.value = false; // closes the bottom sheet
};

const limparFiltros = () => {
  model.value = null;
  modelTamanho.value = null;
  sortOption.value = 'nossa-selecao';
};

// --- Product Card Link Generation ---
const gerarLink = (descricao) => {
  return `/produto/${descricao
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces become hyphens
    .replace(/[^\w-]+/g, '') // removes special characters
  }`;
};

// --- Static Data (Items, Categories, Colors, Sizes) ---
const items = [
  { title: 'Vestuário', href: '/lacoste/vestuario', disabled: false },
  { title: 'Calçados', href: '/lacoste/calcados', disabled: false },
  { title: 'Acessórios', href: '/lacoste/acessorios21', disabled: false },
  { title: 'Polos', href: '/lacoste/vestuario/polos', disabled: false },
  { title: 'Tenis', href: '/lacoste/calcados', disabled: false },
  { title: 'Bonés & Chapéus', href: '/lacoste/acessorios/bones&chapeus', disabled: false },
  { title: 'Mochilas & Bolsas', href: '/lacoste/acessorios/mochilas&bolsas', disabled: false },
  { title: 'Camisetas', href: '/lacoste/vestuario/camisetas', disabled: false },
  { title: 'Moletons & Jaquetas', href: '/lacoste/vestuario/sueters&moletom', disabled: false },
  { title: 'Calças & Bermudas', href: '/lacoste/vestuario/calcas&bermudas', disabled: false }, // <- este aqui é o último
];

const categorias = [
  'Vestuario', 'Boné', 'Cueca', 'Acessorios', 'Calçados',
  'Camisetas', 'Polos', 'Moletons & Jaquetas', 'Calças & Bermudas',
];

const cores = [
  'Preto', 'Cinza', 'Branco', 'Marrom', 'Bege', 'Verde', 'Azul',
  'Roxo', 'Vermelho', 'Rosa', 'Amarelo', 'Laranja',
];

const tamanhos = [
  '38', '39', '40', '41', '42', '43', '44', '45', '46', '50', '52',
  'xs', 's', 'm', 'l', 'xl', 'xxl', '3xl',
  'xs/2', 's/3', 'm/4', 'm-l/5', 'l6', 'xl/7', 'xxl/8', '3xl/9',
  '54', '56', '58', '90', '100', '110',
  '1-34/32', '2-29/32', '3-30/32', '4-90', '5-100', '5-31/32', '6-110', '7-32/32', '9-33/32',
  'br38|38z32', 'br40|40z32', 'br42|42x32', 'br44|44x32', 'br46|46x32', 'br48|48x32',
  'Tamanho unico',
];

const model = ref(null); // selected color in filters
const modelTamanho = ref(null); // selected size in filters

// --- Computed Property for Filtered Products ---
const produtosFiltrados = computed(() => {
  return catalogo.produtos.filter(produto => {
    const categoriaMatch = produto.categoriaProduto === 'Camisetas';

    const corMatch = model.value
      ? produto.coresSelecionadas?.includes(model.value)
      : true;

    const tamanhoMatch = modelTamanho.value
      ? produto.tamanhosSelecionados?.includes(modelTamanho.value)
      : true;

    return categoriaMatch && corMatch && tamanhoMatch;
  });
});


// --- Lifecycle Hook ---
onMounted(async () => {
  await catalogo.carregarProdutos();
  // Initialize imagensCarregadas based on current products
  imagensCarregadas.value = catalogo.produtos.map(() => false);
  preCarregarImagens();
});

// --- Selection Functions for Filters ---
const selectCor = (cor) => {
  model.value = cor === model.value ? null : cor;
};

const selectTamanho = (tamanho) => {
  modelTamanho.value = tamanho === modelTamanho.value ? null : tamanho;
};

// --- Image Handling Functions ---
const obterUrlImagem = (img) => {
  if (typeof img === 'string') {
    if (img.startsWith('https://') || img.startsWith('blob:')) return img;
    if (img.startsWith('http://')) return img;
    return `https://pedro-lacst.s3.us-west-2.amazonaws.com/${img}`;
  }
  return '';
};

// MODIFICADO: Passa o produto completo para 'abrirImagem'
const abrirImagem = (produtoIdx, imgIdx) => {
  const produto = produtosFiltrados.value[produtoIdx];
  imagensDialog.value = produto.imagensProdutos.map(obterUrlImagem);
  currentImage.value = imgIdx;
  currentProductDescription.value = produto;

  // Garante que os campos sejam arrays
  if (typeof currentProductDescription.value.coresSelecionadas === 'string') {
    try {
      currentProductDescription.value.coresSelecionadas = JSON.parse(currentProductDescription.value.coresSelecionadas);
    } catch {
      currentProductDescription.value.coresSelecionadas = [];
    }
  }

  if (typeof currentProductDescription.value.tamanhosSelecionados === 'string') {
    try {
      currentProductDescription.value.tamanhosSelecionados = JSON.parse(currentProductDescription.value.tamanhosSelecionados);
    } catch {
      currentProductDescription.value.tamanhosSelecionados = [];
    }
  }

  dialogImagem.value = true;
};


// --- Product Editing Dialog Functions -

const removerImagem = (index) => {
  produtoEditando.value.imagensProdutos.splice(index, 1);
};

const fecharDialogEdicao = () => {
  produtoEditando.value = catalogo.getEstadoInicial(); // Reset to initial state
  dialogEdicao.value = false;
  novaImagemUrl.value = ''; // Clear URL input
};

const salvarEdicao = async () => {
  try {
    const imagensNovas = produtoEditando.value.imagensProdutos.filter(img => img.startsWith('blob:'));
    const imagensExistentes = produtoEditando.value.imagensProdutos.filter(img => !img.startsWith('blob:'));

    const formData = new FormData();

    // Append product fields
    formData.append('descricaoProduto', produtoEditando.value.descricaoProduto);
    formData.append('valorProduto', produtoEditando.value.valorProduto);
    formData.append('valorDesconto', produtoEditando.value.valorDesconto);
    formData.append('marcaProduto', produtoEditando.value.marcaProduto);
    formData.append('categoriaProduto', produtoEditando.value.categoriaProduto);
    formData.append('generoProduto', produtoEditando.value.generoProduto);
    formData.append('estoqueProduto', produtoEditando.value.estoqueProduto);
    formData.append('tamanhosSelecionados', JSON.stringify(produtoEditando.value.tamanhosSelecionados));
    formData.append('coresSelecionadas', JSON.stringify(produtoEditando.value.coresSelecionadas));

    // Append existing image names (server will handle keeping them)
    formData.append('imagensProdutosExistentes', JSON.stringify(imagensExistentes));

    // Append new image files (blobs)
    for (const localUrl of imagensNovas) {
      const response = await fetch(localUrl);
      const blob = await response.blob();
      const file = new File([blob], `imagem-${Date.now()}.webp`, { type: blob.type });
      formData.append('imagensProdutos', file); // 'imagensProdutos' should match backend field name
    }

    // Send as multipart/form-data
    await catalogo.atualizarProduto(produtoEditando.value._id, formData);

    // Update local list after successful save (optimistic update)
    const index = catalogo.produtos.findIndex(p => p._id === produtoEditando.value._id);
    if (index !== -1) {
      catalogo.produtos[index] = JSON.parse(JSON.stringify(produtoEditando.value));
    }

    fecharDialogEdicao();
  } catch (error) {
    console.error('Erro ao salvar alterações:', error);
  }
};

const adicionarImagemPorUrl = () => {
  if (novaImagemUrl.value && novaImagemUrl.value.trim() !== '') {
    produtoEditando.value.imagensProdutos.push(novaImagemUrl.value.trim());
    novaImagemUrl.value = '';
  }
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  for (const file of Array.from(files)) {
    const localUrl = URL.createObjectURL(file);
    produtoEditando.value.imagensProdutos.push(localUrl);
  }
};

// --- Image Preloading for Skeleton Loader ---
const preCarregarImagens = () => {
  catalogo.produtos.forEach((produto, index) => {
    if (produto.imagensProdutos && produto.imagensProdutos.length > 0) {
      Promise.all(
        produto.imagensProdutos.map(
          (img) =>
            new Promise((resolve) => {
              const el = new Image();
              el.src = obterUrlImagem(img);
              el.onload = resolve;
              el.onerror = resolve; // Resolve even on error to avoid infinite loading
            })
        )
      ).then(() => {
        imagensCarregadas.value[index] = true;
      }).catch(e => console.error("Erro no pré-carregamento:", e));
    } else {
      imagensCarregadas.value[index] = true;
    }
  });
};

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

.breadcrumbs-scroll {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  display: flex;
  
}
.breadcrumbs-scroll .v-breadcrumbs {
  flex: 0 0 auto;
}
.textosCard {
  color: #002D18;
  font-weight: 500;
  font-size: 10px;
 
}
.textosVisualizacaoRapida {
  color: #002D18;
  font-weight: 500;
  font-size: 16px;
 
}
.tituloFiltro{
  font-size: 20px;
  color: #002D18;
  font-weight: 400;
  text-transform: uppercase;
}
.limparFiltro{
  font-size: 12px;
  color: #002D18;
   text-decoration:underline;
}
.no-border-panel :deep(.v-expansion-panel__container),
.no-border-panel :deep(.v-expansion-panel-text__wrapper) {
  border: none !important;
  background: #fff;
}
.tituloExp{
  color: #002011;
  font-weight: 500;
  font-size: 20px;
}
.radio-right-icon :deep(.v-radio) {
  flex-direction: row-reverse; /* Inverte a ordem do label e do rádio */
  justify-content: space-between; /* Empurra o label para um lado e o ícone para o outro */
}

.subtituloFiltro{
  color: #002011;
  font-weight: 400;
  font-size: 12px;
}

.classificaFiltro{
  color: #002011;
  font-weight: 400;
  font-size: 10px;
}

.subtituloCor {
  color: #002011;
  font-weight: 500;
  font-size: 18px;
 
}
.subtituloTamanho {

  color: #002011;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 20px;
 
}
.addSacola{
  background-color: #002D18 !important;
  color: white !important;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Estilos para o router-link */
.link-produto {
  text-decoration: none; /* Remove o sublinhado por padrão */
  color: inherit; /* Garante que a cor seja herdada de .textosCard, se desejar */
  transition: text-decoration 0.2s ease; /* Adiciona uma transição suave para o sublinhado */
}
/* Regra para aplicar o sublinhado APENAS ao passar o mouse */
.link-produto:hover {
  text-decoration: underline; /* Adiciona o sublinhado ao passar o mouse */
}
/* Opcional: Estilo para o valor de desconto riscado */
.text-decoration-line-through {
  text-decoration: line-through;
}
.border {
  border: 1px solid #414141b0;
}
.carousel-portfolio {
  border-bottom: 0px solid #e0e0e0; /* Add a subtle border below carousel */
}
.carousel-image {
  height: 100%;
  width: 100%;
}
.beadcrumbs {
  font-size: 16px;
  color: #1b5e20;
  font-weight: 500;
}

.titulo {
  font-size: 24px;
  color: #002D18;
  font-weight: 400;
  text-transform: uppercase;
}
.tituloVisualizacaoRapida {
  font-size: 20px;
  color: #002D18;
  font-weight: 500;
  text-transform: uppercase;
}
/* Toolbar com borda cinza */
.toolbar {
  border: 1px solid #002D18; /* Borda cinza clara */
  background-color: #fff; /* Fundo branco sólido */

}

.toolbar .v-btn {
   min-height: 60px !important; /* Deixa os botões mais altos */
  font-size: 14px; /* Texto menor */
}

.toolbar .v-icon {
  font-size: 16px; /* Ícone menor */
}

.resultados {
  font-size: 10px;
  color: #002D18; /* Verde claro para os resultados */
}
/* Botão FILTROS */
.btn-filtros {
  color: white;
  background-color: #002D18 !important;
  font-weight: 400;
  font-size: 12px;
}

/* Botões CORES e TAMANHO */
.btn-opcoes {
  color: #002D18;
  font-weight: 400;
  font-size: 12px;
}

/* Card com borda cinza */
.produto-card {
  border: 1px solid #002D18; /* Borda cinza clara */
  border-radius: 1px;
  transition: box-shadow 0.3s;
}

/* Dialog de Edição */
.v-dialog .v-card {
  border-radius: 0 !important;
}
/* Draggable container for images */
.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}
.draggable-image-card {
  border: 1px solid #ddd;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
/* Buttons in Dialog */
.v-btn {
  border-radius: 0 !important;
  box-shadow: none !important;
}

.v-card-actions.bg-grey-lighten-4 {
  background-color: #f5f5f5 !important;
  border-top: 1px solid #eee;
}

/* Carousel in Dialog de Imagens Ampliadas */
.v-dialog .v-carousel {
  background-color: black; /* Black background for image viewer */
}

.v-dialog .v-carousel .v-img {
  max-height: calc(100vh - 100px); /* Limit height to screen size */
}
.botaolacoste {
  background-color: #002D18 !important;
  color: white !important;
  font-weight: 500;
  font-size: 14px;
  border-radius: 0 !important;
}

.descricaoTitulo {
  font-size: 18px;
  color: #002D18;
  font-weight: 500;
}
.CorTamanho {
  font-size: 16px;
  color: #002D18;
  font-weight: 300;
}
.textosProduto {
  font-size: 18px;
  color: #002D18;
  font-weight: 400;
}
</style>