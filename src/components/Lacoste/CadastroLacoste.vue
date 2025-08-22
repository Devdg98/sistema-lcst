<template>
  <div>
    <v-card-title class="text-h6 font-weight-bold">Cadastrar Produto</v-card-title>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="produto.marcaProduto" label="Marca do Produto" required />
              </v-col>
              <v-col cols="12" sm="6">
              <v-select
                v-model="produto.categoriaProduto"
                :items="categorias"
                label="Categoria"
                required
                outlined
                dense
              />
            </v-col>

              <v-col cols="12">
                <v-text-field v-model="produto.descricaoProduto" label="Descrição" />
              </v-col>
              <v-col cols="6" sm="3">
  <v-select
    v-model="produto.tamanhosSelecionados" 
    :items="tamanhos"
    label="Tamanhos"
    multiple
    clearable
    filterable
    outlined
    dense
  />
</v-col>

<v-col cols="6" sm="3">
  <v-select
    v-model="produto.coresSelecionadas"
    :items="cores"
    label="Cor"
    clearable
    outlined
    dense
    filterable
    multiple
  />
</v-col>


              <v-col cols="6" sm="3">
                <v-text-field v-model="produto.generoProduto" label="Gênero" />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model="produto.estoqueProduto" label="Estoque" type="number" />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="produto.valorProduto" label="Valor" prefix="R$" type="number" />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="produto.valorDesconto" label="Desconto" prefix="R$" type="number" />
              </v-col>
            </v-row>

            <!-- Upload de imagens -->
            <v-divider class="my-4" />
            <v-row align="center">
              <v-col cols="8">
                <v-text-field v-model="novaImagemUrl" label="Adicionar imagem por URL" />
              </v-col>
              <v-col cols="4">
                <v-btn @click="adicionarImagemPorUrl" color="primary" block>Adicionar</v-btn>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  multiple
                  accept="image/*"
                  label="Upload de Imagens"
                  @change="handleFileUpload"
                />
              </v-col>
            </v-row>

            <!-- Lista de imagens com drag -->
            <draggable v-model="produto.imagensProdutos" class="d-flex flex-wrap gap-4">
            <template #item="{ element, index }">
              <v-card width="130" class="pa-2" elevation="1">
                <v-img :src="obterUrlImagem(element)" height="100" cover class="mb-2" />
                <v-btn color="red" icon @click="removerImagem(index)" size="small">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card>
            </template>
          </draggable>

          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="fecharDialog">Cancelar</v-btn>
          <v-btn color="green darken-1" @click="submitProduto">Salvar</v-btn>
        </v-card-actions>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useProdutosLacoste } from '@/store/produtosLacoste';
import draggable from 'vuedraggable';

const produtos = useProdutosLacoste();
const dialog = ref(false);
const novaImagemUrl = ref('');
const imagensParaUpload = ref([]);
const progressoUpload = ref(0);

const categorias = [
  'Vestuario',
  'Acessorios',
  'Calçados',
  'Camisetas',
  'Polos',
  'Moletons & Jaquetas',
  'Calças & Bermudas',
  'Bones & Chapéus',
];
const cores = [
  'Preto',
  'Cinza',
  'Branco',
  'Marrom',
  'Bege',
  'Verde',
  'Azul',
  'Roxo',
  'Vermelho',
  'Rosa',
  'Amarelo',
  'Laranja',
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


const produto = ref({
  marcaProduto: "Lacoste",
  categoriaProduto: "",
  descricaoProduto: "",
  tamanhoProduto: "",
  corProduto: "",
  generoProduto: "",
  estoqueProduto: "",
  valorDesconto: null,
  valorProduto: null,
  imagensProdutos: [],
  tamanhosSelecionados: [],
  coresSelecionadas: [],
});


const obterUrlImagem = (img) => {
  if (typeof img === 'string' && img.startsWith('https://')) return img;
  if (img instanceof File) return URL.createObjectURL(img);
  return `https://para-construcoes.s3.us-west-2.amazonaws.com/${img}`;
};

const fecharDialog = () => {
  dialog.value = false;
  produto.value = {
    marcaProduto: '',
    categoriaProduto: '',
    descricaoProduto: '',
    tamanhoProduto: '',
    corProduto: '',
    generoProduto: '',
    estoqueProduto: '',
    valorDesconto: null,
    valorProduto: null,
    imagensProdutos: [],
  };
  novaImagemUrl.value = '';
  imagensParaUpload.value = [];
  progressoUpload.value = 0;
};

const removerImagem = (index) => {
  produto.value.imagensProdutos.splice(index, 1);
};

const adicionarImagemPorUrl = () => {
  if (novaImagemUrl.value) {
    produto.value.imagensProdutos.push(novaImagemUrl.value);
    novaImagemUrl.value = '';
  }
};
const handleFileUpload = async (event) => {
  const files = event.target.files || event.dataTransfer.files;
  if (!files.length) return;

  for (const file of Array.from(files)) {
    const localUrl = URL.createObjectURL(file);
    produto.value.imagensProdutos.push(localUrl);
    try {
      
      const uploadedImageUrl = await produtos.uploadImagem(file);
      const indexToReplace = produto.value.imagensProdutos.findIndex(url => url === localUrl);
      if (indexToReplace !== -1) {
        produto.value.imagensProdutos[indexToReplace] = uploadedImageUrl;
      } 
   
      progressoUpload.value = 100;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      produto.value.imagensProdutos = produto.value.imagensProdutos.filter(url => url !== localUrl);
    } finally {
      progressoUpload.value = 0;
    }
  }
  imagensParaUpload.value = [];
};


const submitProduto = async () => {
  try {
   const datatoSend = {
    marcaProduto: produto.value.marcaProduto,
    categoriaProduto: produto.value.categoriaProduto,
    descricaoProduto: produto.value.descricaoProduto,
    tamanhosSelecionados: produto.value.tamanhosSelecionados, // ✅ AGORA VAI
    coresSelecionadas: produto.value.coresSelecionadas,       // ✅ AGORA VAI
    generoProduto: produto.value.generoProduto,
    estoqueProduto: produto.value.estoqueProduto,
    valorDesconto: produto.value.valorDesconto,
    valorProduto: produto.value.valorProduto,
    imagensProdutos: produto.value.imagensProdutos.filter(url => url.startsWith('https://')),
  };

    await produtos.criarProduto(datatoSend);
    fecharDialog();
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
  }
};
</script>
