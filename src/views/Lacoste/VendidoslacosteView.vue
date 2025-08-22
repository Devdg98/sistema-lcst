<template>
  <div class="bg-white">
    <v-breadcrumbs class="beadcrumbs pa-6" :items="items"></v-breadcrumbs>

    <h2 class="titulo pa-6">Produtos Mais Vendidos</h2>

    <v-toolbar class="toolbar pa-0 mb-2" flat color="white">
      <v-bottom-sheet v-model="filtrosAtivos">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" class="btn-filtros" rounded="0" dark>
            <v-icon start>mdi-filter-variant</v-icon>
            FILTROS
          </v-btn>
          <v-btn v-bind="activatorProps" class="btn-opcoes" rounded="0">
            CORES
          </v-btn>
          <v-btn v-bind="activatorProps" class="btn-opcoes" rounded="0">
            TAMANHO
          </v-btn>
        </template>

        <v-sheet class="pa-4 rounded-0" elevation="0">
          <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-subtitle-1 font-weight-medium text-green-darken-4">
              FILTROS E SEPARADORES
            </h2>
            <v-btn
              icon="mdi-close"
              variant="text"
              color="green-darken-4"
              @click="closeFilter"
              rounded="0"
            ></v-btn>
          </div>

          <div class="mb-4">
            <p class="text-caption text-green-darken-3 font-weight-medium mb-2">
              CLASSIFICAR POR
            </p>
            <v-radio-group v-model="sortOption" color="green-darken-4" hide-details>
              <v-radio label="Nossa seleção" value="nossa-selecao"></v-radio>
              <v-radio label="Menor preço" value="menor-preco"></v-radio>
              <v-radio label="Maior preço" value="maior-preco"></v-radio>
              <v-radio label="Mais vendidos" value="mais-vendidos"></v-radio>
            </v-radio-group>
          </div>

          <div>
            <p class="text-caption text-green-darken-3 font-weight-medium mb-2">
              FILTRAR POR
            </p>
            <v-expansion-panels variant="accordion">
              <v-expansion-panel title="Cores" rounded="0">
                <v-expansion-panel-text>
                  <v-row class="pa-4">
                    <v-col
                      class="pa-2"
                      v-for="cor in cores"
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
                        <div
                          :style="{ backgroundColor: cor.toLowerCase(), height: '8px' }"
                        ></div>
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
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel title="Tamanho" rounded="0">
                <v-expansion-panel-text>
                  <v-row class="pa-4">
                    <v-col
                      class="pa-1"
                      v-for="tamanho in tamanhos"
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
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <div class="d-flex flex-column mt-6">
            <v-btn
              v-if="model || modelTamanho"
              variant="text"
              color="green-darken-4"
              class="text-caption mb-2 rounded-0"
              @click="limparFiltros"
            >
              Limpar tudo
            </v-btn>
            <v-btn
              color="green-darken-3"
              class="text-white rounded-0"
              block
              @click="verProdutos"
            >
              VER PRODUTOS
            </v-btn>
          </div>
        </v-sheet>
      </v-bottom-sheet>

      <v-spacer></v-spacer>

      <div class="resultados d-flex align-center">
        {{ produtosFiltrados.length }} RESULTADOS
      </div>
    </v-toolbar>

    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        v-for="(produto, idx) in produtosFiltrados"
        :key="produto._id"
        class="pa-0"
      >
        <v-card class="border rounded-0" flat>
          <v-skeleton-loader
            v-if="!imagensCarregadas[idx]"
            type="image"
            height="200"
            class="rounded-0"
          />

          <v-carousel
            v-else
            cycle
            :height="600"
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

          <v-card-text class="textosCard pa-6">
            <div class="mt-2">
              <span :class="{ 'text-decoration-line-through': produto.valorProduto && produto.valorDesconto }">
                {{ produto.valorProduto }}
              </span>
              <span v-if="produto.valorDesconto" class="text-caption ml-2">
                {{ produto.valorDesconto }}
              </span>
            </div>
            <router-link
              :to="gerarLink(produto.descricaoProduto)"
              class="text-body-2 link-produto"
            >
              {{ produto.descricaoProduto || 'Sem descrição' }}
            </router-link>
          </v-card-text>

          <v-card-actions class="d-flex justify-end pa-2">
            <v-btn
              icon
              size="small"
              @click="abrirDialogEdicao(produto)"
              color="blue-darken-2"
              rounded="0"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="red-darken-2"
              @click="catalogo.excluirProduto(produto._id)"
              rounded="0"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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

    <v-dialog
      v-model="dialogImagem"
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-card rounded="0">
        <v-carousel
          v-if="imagensDialog.length"
          v-model="currentImage"
          hide-delimiters
          show-arrows="hover"
          class="rounded-0"
        >
          <v-carousel-item v-for="(img, idx) in imagensDialog" :key="idx">
            <v-img :src="img" cover class="fill-height rounded-0" />
          </v-carousel-item>
        </v-carousel>
        <v-card-actions class="bg-black d-flex justify-end">
          <v-btn icon color="white" @click="dialogImagem = false" rounded="0">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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

// --- Filter/Sort Functions ---
const closeFilter = () => {
  filtrosAtivos.value = false;
};

const verProdutos = () => {
  // Here you can trigger the actual filtering/sorting logic, e.g., re-fetch from API
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
  { title: 'Vestuário', href: '/lacoste/vestuario' },
  { title: 'Calçados', href: '/lacoste/calcados' },
  { title: 'Acessórios', href: '/lacoste/acessorios21' },
  { title: 'Polos', href: '/lacoste/vestuario/polos' },
  { title: 'Tenis', href: '/lacoste/calcados' },
  { title: 'Bonés & Chapéus', href: '/lacoste/acessorios/bones&chapeus' },
  { title: 'Mochilas & Bolsas', href: '/lacoste/acessorios/bones&chapeus' },
  { title: 'Camisetas', href: '/lacoste/vestuario/camisetas' },
  { title: 'Moletons & Jaquetas', href: '/lacoste/vestuario/sueters&moletom' },
  { title: 'Calças & Bermudas', href: '/lacoste/vestuario/calcas&bermudas' }, 
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
    const corMatch = model.value
      ? produto.coresSelecionadas?.includes(model.value)
      : true;

    const tamanhoMatch = modelTamanho.value
      ? produto.tamanhosSelecionados?.includes(modelTamanho.value)
      : true;

    return corMatch && tamanhoMatch;
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
    // Assuming 'http' might also be a valid external URL
    if (img.startsWith('http://')) return img;
    return `https://pedro-lacst.s3.us-west-2.amazonaws.com/${img}`;
  }
  return '';
};

const abrirImagem = (produtoIdx, imgIdx) => {
  const produto = produtosFiltrados.value[produtoIdx]; // use filtered products here
  imagensDialog.value = produto.imagensProdutos.map(obterUrlImagem);
  currentImage.value = imgIdx;
  dialogImagem.value = true;
};

// --- Product Editing Dialog Functions ---
const abrirDialogEdicao = (produtoSelecionado) => {
  produtoEditando.value = JSON.parse(JSON.stringify(produtoSelecionado));
  dialogEdicao.value = true;
};

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
      // Use a more robust way to get file extension if needed, or assume webp/jpeg
      const file = new File([blob], `imagem-${Date.now()}.webp`, { type: blob.type });
      formData.append('imagensProdutos', file); // 'imagensProdutos' should match backend field name
    }

    // Send as multipart/form-data
    await catalogo.atualizarProduto(produtoEditando.value._id, formData);

    // Update local list after successful save (optimistic update)
    const index = catalogo.produtos.findIndex(p => p._id === produtoEditando.value._id);
    if (index !== -1) {
      // Create a deep copy to ensure reactivity updates if properties are added/removed
      catalogo.produtos[index] = JSON.parse(JSON.stringify(produtoEditando.value));
    }

    fecharDialogEdicao();
  } catch (error) {
    console.error('Erro ao salvar alterações:', error);
    // You might want to show a user-friendly error message here
  }
};

const adicionarImagemPorUrl = () => {
  if (novaImagemUrl.value && novaImagemUrl.value.trim() !== '') {
    produtoEditando.value.imagensProdutos.push(novaImagemUrl.value.trim());
    novaImagemUrl.value = ''; // Clear the input after adding
  }
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  for (const file of Array.from(files)) {
    const localUrl = URL.createObjectURL(file); // Generates a temporary URL for preview
    produtoEditando.value.imagensProdutos.push(localUrl);
  }
};

// --- Image Preloading for Skeleton Loader ---
const preCarregarImagens = () => {
  catalogo.produtos.forEach((produto, index) => {
    // Only preload if there are images
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
        // Only set to true if images were actually loaded
        imagensCarregadas.value[index] = true;
      }).catch(e => console.error("Erro no pré-carregamento:", e));
    } else {
      // If no images, still mark as loaded to show placeholder/empty state
      imagensCarregadas.value[index] = true;
    }
  });
};
</script>

<style scoped>
.textosCard {
  color: #0d3b15;
  font-weight: 400;
  font-size: 14px;
  text-transform: uppercase;
}

/* Estilos para o router-link */
.link-produto {
  text-decoration: none; /* Remove o sublinhado por padrão */
  color: inherit; /* Garante que a cor seja herdada de .textosCard, se desejar */
  /* ou defina uma cor específica: color: #0d3b15; */
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
.v-card.border {
  border: 0px solid #e0e0e0;
}
.carousel-portfolio {
  border-bottom: 1px solid #e0e0e0; /* Add a subtle border below carousel */
}
.carousel-image {
  object-fit: cover;
  height: 100%;
  width: 100%;
}

/* Icons for actions */
.v-card-actions .v-btn {
  margin: 0 4px; /* Adjust spacing between buttons */
}
.v-card-actions .v-icon {
  font-size: 20px; /* Make icons a bit larger */
}

/* Dialog de Edição */
.v-dialog .v-card {
  border-radius: 0 !important;
}

.beadcrumbs {
  font-size: 16px;
  color: #1b5e20;
  font-weight: 500;
}

.beadcrumbs a {
  color: #1b5e20 !important;
  text-decoration: none;
  font-weight: 400;
}

.beadcrumbs a:hover {
  color: #0d3b15;
}

.titulo {
  font-size: 32px;
  color: #0d3b15;
  font-weight: 400;
  margin-bottom: 16px;
  text-transform: uppercase;
}

/* Toolbar com borda cinza */
.toolbar {
  border: 1px solid #e0e0e0; /* Borda cinza clara */
  background-color: #fff; /* Fundo branco sólido */
  min-height: 40px; /* Altura levemente maior para não esmagar */
  box-sizing: border-box; /* garante que padding seja contado no tamanho */

}

.toolbar .v-btn {
  min-height: 30px !important; /* Deixa os botões mais altos */
  padding: 0 12px; /* Ajuste horizontal */
  font-size: 13px; /* Texto menor */
}

.toolbar .v-icon {
  font-size: 16px; /* Ícone menor */
}

.resultados {
  font-size: 12px;
  color: #388e3c; /* Verde claro para os resultados */
}
/* Botão FILTROS */
.btn-filtros {
  color: white;
  background-color: #1b5e20 !important;
  font-weight: 500;
  font-size: 12px;
}

/* Botões CORES e TAMANHO */
.btn-opcoes {
  color: #388e3c;
  font-weight: 400;
  font-size: 12px;
}


/* Card com borda cinza */
.produto-card {
  border: 1px solid #e0e0e0; /* Borda cinza clara */
  border-radius: 4px;
  transition: box-shadow 0.3s;
}

.produto-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Leve sombra no hover */
}

.v-card-text.pa-4 {
  padding: 16px !important;
}

/* TextField in Dialog */
.v-text-field {
  margin-bottom: 16px;
}
.v-text-field.flex-grow-1 {
  flex-grow: 1;
}
.v-text-field .v-input__control {
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
</style>