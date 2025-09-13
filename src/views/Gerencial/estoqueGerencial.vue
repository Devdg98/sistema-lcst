<template>
  <v-container fluid class="pa-0">
    <!-- HEADER -->
    <v-toolbar flat color="white" class="rounded-0">
      <v-toolbar-title class="text-h6 font-weight-bold">📦 Gestão de Estoque</v-toolbar-title>
      <v-spacer />
      <v-chip class="ma-1" variant="elevated" color="grey-lighten-4">
        Total em estoque: <strong class="ml-1">{{ totalEstoque }}</strong>
      </v-chip>
      <v-chip class="ma-1" variant="elevated" color="grey-lighten-4">
        Total de modelos: <strong class="ml-1">{{ totalModelos }}</strong>
      </v-chip>
      <v-divider vertical class="mx-3" />
      <v-btn variant="flat" color="black" class="text-white" prepend-icon="mdi-plus" @click="novoProduto">
        Novo Produto
      </v-btn>
    </v-toolbar>

    <!-- SUB TOOLBAR -->
    <v-toolbar flat color="white" class="rounded-0">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Buscar por descrição, categoria, marca..."
        density="comfortable"
        variant="solo-filled"
        hide-details
        class="mr-4"
        style="max-width: 420px"
      />
      <v-chip class="mr-2" variant="outlined">Encontrados: {{ produtosFiltrados.length }}</v-chip>

      <v-divider vertical class="mx-3" />
      <v-btn-toggle v-model="filtros.status" divided class="mr-2" density="comfortable">
        <v-btn value="todos">Todos</v-btn>
        <v-btn value="Novidade">Novidade</v-btn>
        <v-btn value="Destaque">Destaque</v-btn>
        <v-btn value="Promocao">Promoção</v-btn>
        <v-btn value="PromocaoEspecial">Promoção Especial</v-btn>
        <v-btn value="Esgotado">Esgotado</v-btn>
      </v-btn-toggle>

      <v-select
        v-model="filtros.categoria"
        :items="['Todas', ...categorias]"
        density="comfortable"
        variant="outlined"
        label="Categoria"
        hide-details
        style="max-width: 220px"
        class="mr-2"
      />

      <v-select
        v-model="ordenacao"
        :items="itensOrdenacao"
        item-title="label"
        item-value="value"
        density="comfortable"
        variant="outlined"
        label="Ordenar por"
        hide-details
        style="max-width: 220px"
      />

      <v-spacer />
      <v-btn-toggle v-model="modoVisualizacao" divided class="ml-2">
        <v-btn value="cards" icon title="Cards"><v-icon>mdi-view-grid</v-icon></v-btn>
        <v-btn value="tabela" icon title="Tabela"><v-icon>mdi-table</v-icon></v-btn>
      </v-btn-toggle>
    </v-toolbar>

    <!-- AÇÕES EM MASSA -->
    <v-sheet
      v-if="produtosSelecionados.length"
      elevation="2"
      class="d-flex align-center justify-space-between pa-3 sticky-actions"
    >
      <div class="text-body-2">{{ produtosSelecionados.length }} selecionado(s)</div>
      <div class="d-flex ga-2">
        <v-btn color="grey-darken-4" class="text-white" @click="atualizarStatusSelecionados('Normal')">Normal</v-btn>
        <v-btn color="blue" class="text-white" @click="atualizarStatusSelecionados('Novidade')">Novidade</v-btn>
        <v-btn color="purple" class="text-white" @click="atualizarStatusSelecionados('Destaque')">Destaque</v-btn>
        <v-btn color="teal" class="text-white" @click="definirPromocaoMassa">Promoção</v-btn>
        <v-btn color="indigo" class="text-white" @click="abrirPromocaoEspecialMassa">Promoção Especial</v-btn>
        <v-btn color="red" class="text-white" @click="atualizarStatusSelecionados('Esgotado')">Esgotado</v-btn>
      </div>
    </v-sheet>

    <!-- LOADER -->
    <v-row v-if="produtosStore.loading" class="pa-6">
      <v-col cols="12" class="d-flex justify-center">
        <v-progress-circular indeterminate color="black" size="48" />
      </v-col>
    </v-row>

    <!-- CARDS -->
    <v-row v-else-if="modoVisualizacao === 'cards'" class="pa-4 pt-2" dense>
      <v-col
        v-for="produto in produtosOrdenados"
        :key="produto._id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="rounded-lg elevation-2 hoverable">
          <v-img :src="produto.imagensProdutos?.[0]" height="190" cover class="rounded-t-lg">
            <div class="d-flex pa-2 ga-2">
              <v-checkbox v-model="produtosSelecionados" :value="produto._id" hide-details density="compact" class="bg-white rounded px-2" />
              <v-chip v-if="isPromocaoAtiva(produto)" color="teal" size="small" class="text-white">{{ resumoPromocao(produto) }}</v-chip>
              <v-chip v-if="produto.promocaoEspecial?.ativo" color="indigo" size="small" class="text-white">
                Especial{{ produto.promocaoEspecial?.prioridade ? ` • P${produto.promocaoEspecial?.prioridade}` : '' }}
              </v-chip>
              <v-chip v-if="produto.statusVenda === 'Destaque'" color="purple" size="small" class="text-white">Destaque</v-chip>
              <v-chip v-if="produto.statusVenda === 'Novidade'" color="blue" size="small" class="text-white">Novidade</v-chip>
              <v-chip v-if="produto.statusVenda === 'Esgotado'" color="red" size="small" class="text-white">Esgotado</v-chip>
            </div>
          </v-img>

          <v-card-title class="py-2 d-flex justify-space-between align-center">
            <div class="text-subtitle-1 font-weight-bold text-truncate" :title="produto.descricaoProduto">
              {{ produto.descricaoProduto }}
            </div>
            <v-menu>
              <template #activator="{ props }">
                <v-btn icon variant="text" v-bind="props"><v-icon>mdi-dots-vertical</v-icon></v-btn>
              </template>
              <v-list density="compact">
                <v-list-item @click="editarProduto(produto)"><v-list-item-title>Editar</v-list-item-title></v-list-item>
                <v-list-item @click="abrirEdicaoRapida(produto)"><v-list-item-title>Edição rápida</v-list-item-title></v-list-item>
                <v-divider />
                <v-list-item @click="marcarComo('Novidade', produto)"><v-list-item-title>Marcar como Novidade</v-list-item-title></v-list-item>
                <v-list-item @click="marcarComo('Destaque', produto)"><v-list-item-title>Marcar como Destaque</v-list-item-title></v-list-item>
                <v-list-item @click="definirPromocao(produto)"><v-list-item-title>Definir Promoção</v-list-item-title></v-list-item>
                <v-list-item @click="abrirPromocaoEspecial(produto)"><v-list-item-title>Promoção Especial</v-list-item-title></v-list-item>
                <v-divider />
                <v-list-item class="text-red" @click="removerProduto(produto._id)"><v-list-item-title>Excluir</v-list-item-title></v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>

          <v-card-subtitle class="py-1 text-body-2">
            <div>Marca: <strong>{{ produto.marcaProduto || '—' }}</strong></div>
            <div>Categoria: <strong>{{ produto.categoriaProduto }}</strong></div>
          </v-card-subtitle>

          <v-card-text class="pt-1">
            <div class="d-flex align-center ga-2">
              <span class="text-body-1 font-weight-bold">{{ precoFormatado(precoFinal(produto)) }}</span>
              <span v-if="temDescontoVisivel(produto)" class="text-caption text-grey text-decoration-line-through">
                {{ precoFormatado(produto.valorProduto) }}
              </span>
            </div>

            <div class="mt-2">
              <v-chip
                v-for="(v, idx) in (produto.variacoes || [])"
                :key="`${produto._id}-${idx}-${v.cor}-${v.tamanho}`"
                size="small"
                class="ma-1"
                color="blue-grey-lighten-4"
              >
                {{ v.cor }} / {{ v.tamanho }}: <strong class="ml-1">{{ v.estoque ?? 0 }}</strong>
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn size="small" variant="text" @click="marcarComo('Novidade', produto)">Novidade</v-btn>
            <v-btn size="small" variant="text" @click="marcarComo('Destaque', produto)">Destaque</v-btn>
            <v-btn size="small" variant="text" @click="definirPromocao(produto)">Promoção</v-btn>
            <v-btn size="small" variant="text" @click="abrirPromocaoEspecial(produto)">Especial</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- TABELA -->
    <v-card v-else class="ma-4">
      <v-data-table
        :headers="headers"
        :items="produtosOrdenados"
        item-key="_id"
        density="comfortable"
        show-select
        v-model:selected="produtosSelecionados"
      >
        <!-- SLOTS PADRÃO: v-slot:[`item.campo`] -->
        <template v-slot:[`item.descricaoProduto`]="{ item }">
          <div class="d-flex align-center ga-2">
            <v-avatar size="36" rounded v-if="item.imagensProdutos?.[0]">
              <v-img :src="item.imagensProdutos[0]" cover />
            </v-avatar>
            <div class="text-truncate" style="max-width: 280px" :title="item.descricaoProduto">
              {{ item.descricaoProduto }}
            </div>
          </div>
        </template>

        <template v-slot:[`item.preco`]="{ item }">
          <div class="d-flex align-center ga-2">
            <span class="font-weight-bold">{{ precoFormatado(precoFinal(item)) }}</span>
            <span v-if="temDescontoVisivel(item)" class="text-caption text-grey text-decoration-line-through">
              {{ precoFormatado(item.valorProduto) }}
            </span>
          </div>
        </template>

        <template v-slot:[`item.statusVenda`]="{ item }">
          <v-chip :color="statusCor(item.statusVenda)" size="small" class="text-white">
            {{ item.statusVenda || 'Normal' }}
          </v-chip>
        </template>

        <template v-slot:[`item.promocao`]="{ item }">
          <div class="d-flex ga-1 align-center">
            <v-chip v-if="isPromocaoAtiva(item)" color="teal" size="small" class="text-white">{{ resumoPromocao(item) }}</v-chip>
            <v-chip v-if="item.promocaoEspecial?.ativo" color="indigo" size="small" class="text-white">
              Esp.{{ item.promocaoEspecial?.nome ? `: ${item.promocaoEspecial?.nome}` : '' }}
            </v-chip>
          </div>
        </template>

        <template v-slot:[`item.acoes`]="{ item }">
          <v-btn icon size="small" @click="editarProduto(item)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon size="small" @click="abrirEdicaoRapida(item)"><v-icon>mdi-flash</v-icon></v-btn>
          <v-btn icon size="small" color="red" @click="removerProduto(item._id)"><v-icon>mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG CADASTRO/EDIÇÃO COMPLETA -->
    <v-dialog v-model="dialogEdicao" max-width="980px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          ✏️ {{ produtoEditando?._id ? "Editar Produto" : "Cadastrar Produto" }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12" sm="4">
                <v-select v-model="produtoEditando.marcaProduto" :items="['Lacoste','HugoBoss']" label="Marca" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-select v-model="produtoEditando.categoriaProduto" :items="categorias" label="Categoria" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-select v-model="produtoEditando.statusVenda" :items="['Normal','Novidade','Destaque','Esgotado']" label="Status" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="produtoEditando.descricaoProduto" label="Descrição" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="6" sm="3">
                <v-select v-model="produtoEditando.generoProduto" :items="['Masculino','Feminino','Unissex','Infantil','Outro']" label="Gênero" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model.number="produtoEditando.valorProduto" type="number" label="Preço base (R$)" prefix="R$" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model.number="produtoEditando.valorDesconto" type="number" label="Desconto (R$)" prefix="R$" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="6" sm="3">
                <v-switch v-model="produtoEditando.ativo" inset label="Ativo para venda" color="green" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Promoção padrão -->
            <v-row dense>
              <v-col cols="12" sm="3">
                <v-switch v-model="produtoEditando.promocao.ativo" color="teal" inset label="Promoção ativa" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-select v-model="produtoEditando.promocao.tipo" :items="['percentual','valor']" label="Tipo de desconto" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model.number="produtoEditando.promocao.valor" :label="produtoEditando.promocao.tipo === 'percentual' ? 'Percentual (%)' : 'Desconto (R$)'" type="number" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="3" class="d-flex align-center">
                <div class="text-caption">Preço final: <strong>{{ precoFormatado(precoFinal(produtoEditando)) }}</strong></div>
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="produtoEditando.promocao.inicio" label="Início (YYYY-MM-DD)" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="produtoEditando.promocao.fim" label="Fim (YYYY-MM-DD)" variant="outlined" density="comfortable" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Promoção especial -->
            <v-row dense>
              <v-col cols="12" sm="3">
                <v-switch v-model="produtoEditando.promocaoEspecial.ativo" color="indigo" inset label="Promoção Especial" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="produtoEditando.promocaoEspecial.nome" label="Nome campanha" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model.number="produtoEditando.promocaoEspecial.prioridade" label="Prioridade (1-5)" type="number" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model.number="produtoEditando.promocaoEspecial.descontoExtra" label="Desconto extra (R$)" type="number" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="produtoEditando.promocaoEspecial.inicio" label="Início (YYYY-MM-DD)" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="produtoEditando.promocaoEspecial.fim" label="Fim (YYYY-MM-DD)" variant="outlined" density="comfortable" />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- IMAGENS -->
            <v-row align="center" dense>
              <v-col cols="8">
                <v-text-field v-model="novaImagemUrl" label="Adicionar imagem por URL" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="4">
                <v-btn color="black" block class="text-white" @click="adicionarImagemPorUrl">Adicionar</v-btn>
              </v-col>
              <v-col cols="12">
                <v-file-input multiple accept="image/*" label="Upload de imagens" @change="handleFileUpload" variant="outlined" density="comfortable" />
              </v-col>
            </v-row>

            <draggable v-model="produtoEditando.imagensProdutos" item-key="id" class="d-flex flex-wrap ga-3 mt-2">
              <template #item="{ element, index }">
                <v-card width="130" class="pa-2 elevation-1">
                  <v-img :src="obterUrlImagem(element)" height="100" cover class="mb-2 rounded" />
                  <v-btn color="red" icon @click="removerImagem(index)" size="small"><v-icon>mdi-close</v-icon></v-btn>
                </v-card>
              </template>
            </draggable>

            <v-divider class="my-4" />

            <!-- VARIAÇÕES -->
            <v-row>
              <v-col cols="12" class="d-flex justify-space-between align-center">
                <div class="text-subtitle-2 font-weight-medium">Variações</div>
                <v-btn color="black" class="text-white" size="small" @click="adicionarVariacao">Adicionar variação</v-btn>
              </v-col>

              <v-col cols="12">
                <v-row
                  v-for="(v, i) in produtoEditando.variacoes"
                  :key="v.__id"
                  class="align-center"
                >
                  <v-col cols="12" sm="3">
                    <v-select v-model="v.cor" :items="cores" label="Cor" variant="outlined" density="comfortable" />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-select v-model="v.tamanho" :items="tamanhos" label="Tamanho" variant="outlined" density="comfortable" />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-text-field v-model.number="v.estoque" type="number" min="0" label="Estoque" variant="outlined" density="comfortable" />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field v-model="v.imagem" label="Imagem (URL)" variant="outlined" density="comfortable" />
                  </v-col>
                  <v-col cols="12" sm="1" class="d-flex justify-end">
                    <v-btn icon color="red" @click="removerVariacao(i)"><v-icon>mdi-close</v-icon></v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="fecharDialogEdicao">Cancelar</v-btn>
          <v-btn color="black" class="text-white" @click="salvarProduto">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DRAWER EDIÇÃO RÁPIDA -->
    <v-navigation-drawer v-model="drawerEdicaoRapida" location="right" width="420" temporary>
      <v-toolbar flat>
        <v-toolbar-title class="text-subtitle-1">Edição rápida</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="drawerEdicaoRapida = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-divider />
      <v-container>
        <v-text-field v-model="rapido.descricao" label="Descrição" variant="outlined" density="comfortable" class="mb-2" />
        <v-text-field v-model.number="rapido.preco" type="number" label="Preço base (R$)" prefix="R$" variant="outlined" density="comfortable" class="mb-2" />
        <v-select v-model="rapido.status" :items="['Normal','Novidade','Destaque','Esgotado']" label="Status" variant="outlined" density="comfortable" class="mb-2" />
        <v-divider class="my-4" />
        <div class="text-subtitle-2 mb-2">Promoção</div>
        <v-switch v-model="rapido.promoAtiva" color="teal" inset label="Ativa" />
        <v-select v-model="rapido.promoTipo" :items="['percentual','valor']" label="Tipo" variant="outlined" density="comfortable" class="mb-2" />
        <v-text-field v-model.number="rapido.promoValor" type="number" :label="rapido.promoTipo === 'percentual' ? 'Percentual (%)' : 'Desconto (R$)'" variant="outlined" density="comfortable" class="mb-2" />
        <v-row>
          <v-col cols="6"><v-text-field v-model="rapido.promoInicio" label="Início" placeholder="YYYY-MM-DD" variant="outlined" density="comfortable" /></v-col>
          <v-col cols="6"><v-text-field v-model="rapido.promoFim" label="Fim" placeholder="YYYY-MM-DD" variant="outlined" density="comfortable" /></v-col>
        </v-row>
        <v-btn color="black" class="text-white" block @click="aplicarEdicaoRapida">Aplicar</v-btn>
      </v-container>
    </v-navigation-drawer>

    <!-- DIALOG PROMOÇÃO ESPECIAL EM MASSA -->
    <v-dialog v-model="dialogPromocaoEspecialMassa" max-width="560px">
      <v-card>
        <v-card-title class="text-h6">Promoção Especial (em massa)</v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="promoEspecialMassa.nome" label="Nome da campanha" variant="outlined" density="comfortable" />
            <v-text-field v-model.number="promoEspecialMassa.prioridade" label="Prioridade (1-5)" type="number" variant="outlined" density="comfortable" />
            <v-text-field v-model.number="promoEspecialMassa.descontoExtra" label="Desconto extra (R$)" type="number" variant="outlined" density="comfortable" />
            <v-row>
              <v-col cols="6"><v-text-field v-model="promoEspecialMassa.inicio" label="Início (YYYY-MM-DD)" variant="outlined" density="comfortable" /></v-col>
              <v-col cols="6"><v-text-field v-model="promoEspecialMassa.fim" label="Fim (YYYY-MM-DD)" variant="outlined" density="comfortable" /></v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogPromocaoEspecialMassa=false">Cancelar</v-btn>
          <v-btn color="indigo" class="text-white" @click="aplicarPromocaoEspecialMassa">Aplicar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import draggable from 'vuedraggable';
import dayjs from 'dayjs';
import { useProdutosLacoste } from '@/store/produtosLacoste';

const produtosStore = useProdutosLacoste();

const search = ref('');
const modoVisualizacao = ref('cards');
const ordenacao = ref('recentes');
const itensOrdenacao = [
  { label: 'Mais recentes', value: 'recentes' },
  { label: 'Menor preço', value: 'preco_asc' },
  { label: 'Maior preço', value: 'preco_desc' },
  { label: 'Mais estoque', value: 'estoque_desc' },
  { label: 'Novidade/Destaque primeiro', value: 'status_prioridade' },
];

const filtros = ref({ status: 'todos', categoria: 'Todas' });
const produtosSelecionados = ref([]);

const dialogEdicao = ref(false);
const drawerEdicaoRapida = ref(false);
const dialogPromocaoEspecialMassa = ref(false);

const categorias = [
  'Vestuario','Acessorios','Calçados','Camisetas','Polos',
  'Moletons & Jaquetas','Calças & Bermudas','Bones & Chapéus'
];
const cores = ['Preto','Cinza','Branco','Marrom','Bege','Verde','Azul','Roxo','Vermelho','Rosa','Amarelo','Laranja'];
const tamanhos = ['38','39','40','41','42','43','44','45','46','50','52','xs','s','m','l','xl','xxl','3xl','Tamanho unico'];

/* ---------- helpers ---------- */
function gid () { return `${Date.now()}-${Math.floor(Math.random() * 100000)}` }
function estadoInicialProduto () {
  return {
    ...(produtosStore.getEstadoInicial?.() || {}),
    imagensProdutos: [],
    variacoes: [],
    promocao: { ativo:false, tipo:'percentual', valor:0, inicio:'', fim:'' },
    promocaoEspecial: { ativo:false, nome:'', prioridade:1, descontoExtra:0, inicio:'', fim:'' },
  }
}
const produtoEditando = ref(estadoInicialProduto());
const novaImagemUrl = ref('');

const rapido = ref({
  _id: null, descricao: '', preco: 0, status: 'Normal',
  promoAtiva: false, promoTipo: 'percentual', promoValor: 0, promoInicio: '', promoFim: ''
});

onMounted(async () => { await produtosStore.carregarProdutos(); });

/** Map para achar produto atual e preservar imagens nas atualizações parciais */
const produtoPorId = computed(() => {
  const map = new Map();
  (produtosStore.produtos || []).forEach(p => map.set(p._id, p));
  return map;
});
function imagensDoProduto(id) {
  const p = produtoPorId.value.get(id);
  return Array.isArray(p?.imagensProdutos) ? p.imagensProdutos : [];
}
/** TODA atualização parcial deve passar por aqui para não apagar imagens */
async function atualizarProdutoPreservandoImagens(id, patch) {
  const imagens = imagensDoProduto(id);
  await produtosStore.atualizarProduto(id, {
    ...patch,
    imagensProdutosExistentes: imagens,
  });
}

/* ---------- Filtros / ordenação ---------- */
const produtosFiltrados = computed(() => {
  let list = produtosStore.produtos || [];
  if (search.value) {
    const s = search.value.toLowerCase();
    list = list.filter(p =>
      (p.descricaoProduto || '').toLowerCase().includes(s) ||
      (p.categoriaProduto || '').toLowerCase().includes(s) ||
      (p.marcaProduto || '').toLowerCase().includes(s)
    );
  }
  if (filtros.value.categoria !== 'Todas') {
    list = list.filter(p => p.categoriaProduto === filtros.value.categoria);
  }
  if (filtros.value.status !== 'todos') {
    if (filtros.value.status === 'Promocao') list = list.filter(p => isPromocaoAtiva(p));
    else if (filtros.value.status === 'PromocaoEspecial') list = list.filter(p => p?.promocaoEspecial?.ativo);
    else list = list.filter(p => (p.statusVenda || 'Normal') === filtros.value.status);
  }
  return list;
});

const produtosOrdenados = computed(() => {
  const list = [...produtosFiltrados.value];
  switch (ordenacao.value) {
    case 'preco_asc': return list.sort((a,b) => precoFinal(a) - precoFinal(b));
    case 'preco_desc': return list.sort((a,b) => precoFinal(b) - precoFinal(a));
    case 'estoque_desc': return list.sort((a,b) => estoqueTotal(b) - estoqueTotal(a));
    case 'status_prioridade': return list.sort((a,b) => prioridadeStatus(b) - prioridadeStatus(a));
    case 'recentes':
    default: return list.sort((a,b) => new Date(b.updatedAt || b._id) - new Date(a.updatedAt || a._id));
  }
});

function estoqueTotal (p) {
  return (p.variacoes || []).reduce((acc, v) => acc + (Number(v?.estoque) || 0), 0);
}
function prioridadeStatus (p) {
  if (p?.promocaoEspecial?.ativo) return 5;
  const s = p.statusVenda || 'Normal';
  if (s === 'Destaque') return 4;
  if (s === 'Novidade') return 3;
  if (s === 'Normal') return 2;
  if (s === 'Esgotado') return 1;
  return 0;
}
function precoFormatado (v) { return Number(v||0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

function isPromocaoAtiva (p) {
  const promo = p?.promocao || {};
  if (!promo?.ativo) return false;
  const hoje = dayjs().format('YYYY-MM-DD');
  const okIni = !promo.inicio || dayjs(hoje).isAfter(dayjs(promo.inicio).subtract(1, 'day'));
  const okFim = !promo.fim || dayjs(hoje).isBefore(dayjs(promo.fim).add(1, 'day'));
  return okIni && okFim;
}
function resumoPromocao (p) {
  const promo = p?.promocao || {};
  if (!promo?.ativo) return '';
  return promo.tipo === 'percentual' ? `-${Number(promo.valor||0)}%` : `-${precoFormatado(promo.valor||0)}`;
}
function temDescontoVisivel (p) { return Number(precoFinal(p)) < Number(p?.valorProduto || 0); }
function precoFinal (p) {
  const base = Number(p?.valorProduto || 0);
  const descBase = Number(p?.valorDesconto || 0);
  let preco = base - descBase;
  const promo = p?.promocao || {};
  if (promo?.ativo) {
    if (promo.tipo === 'percentual') preco = preco * (1 - (Number(promo.valor || 0) / 100));
    else preco = preco - Number(promo.valor || 0);
  }
  const esp = p?.promocaoEspecial || {};
  if (esp?.ativo) preco = preco - Number(esp.descontoExtra || 0);
  return Math.max(preco, 0);
}
function statusCor (status) {
  switch (status) { case 'Novidade': return 'blue'; case 'Destaque': return 'purple'; case 'Esgotado': return 'red'; default: return 'grey'; }
}
const totalEstoque = computed(() => (produtosStore.produtos || []).reduce((t, p) => t + estoqueTotal(p), 0));
const totalModelos = computed(() => (produtosStore.produtos || []).reduce((t, p) => t + [...new Set((p.variacoes || []).map(v => v.cor))].length, 0));

/* ---------- CRUD ---------- */
function novoProduto () {
  produtoEditando.value = estadoInicialProduto();
  dialogEdicao.value = true;
}
function editarProduto (produto) {
  const clone = JSON.parse(JSON.stringify(produto || {}));
  const variacoes = Array.isArray(clone.variacoes) ? clone.variacoes : [];
  variacoes.forEach(v => { if (!v.__id) v.__id = gid(); });

  produtoEditando.value = {
    ...estadoInicialProduto(),
    ...clone,
    imagensProdutos: (clone.imagensProdutos || []).map(u => ({ id: gid(), url: u })),
    variacoes,
    promocao: {
      ativo: clone.promocao?.ativo ?? false,
      tipo: clone.promocao?.tipo ?? 'percentual',
      valor: Number(clone.promocao?.valor ?? 0),
      inicio: clone.promocao?.inicio ?? '',
      fim: clone.promocao?.fim ?? ''
    },
    promocaoEspecial: {
      ativo: clone.promocaoEspecial?.ativo ?? false,
      nome: clone.promocaoEspecial?.nome ?? '',
      prioridade: Number(clone.promocaoEspecial?.prioridade ?? 1),
      descontoExtra: Number(clone.promocaoEspecial?.descontoExtra ?? 0),
      inicio: clone.promocaoEspecial?.inicio ?? '',
      fim: clone.promocaoEspecial?.fim ?? ''
    }
  };
  dialogEdicao.value = true;
}
async function salvarProduto () {
  const variacoesLimpas = (produtoEditando.value.variacoes || [])
    .filter(v => v.cor && v.tamanho)
    .map(v => ({ cor: v.cor, tamanho: v.tamanho, estoque: Number(v.estoque || 0), imagem: v.imagem || '' }));

  const body = {
    marcaProduto: produtoEditando.value.marcaProduto,
    categoriaProduto: produtoEditando.value.categoriaProduto,
    descricaoProduto: produtoEditando.value.descricaoProduto,
    generoProduto: produtoEditando.value.generoProduto,
    valorProduto: Number(produtoEditando.value.valorProduto || 0),
    valorDesconto: Number(produtoEditando.value.valorDesconto || 0),
    ativo: !!produtoEditando.value.ativo,
    statusVenda: produtoEditando.value.statusVenda || 'Normal',
    variacoes: variacoesLimpas,
    imagensProdutosExistentes: (produtoEditando.value.imagensProdutos || []).map(img => img.url),
    promocao: produtoEditando.value.promocao,
    promocaoEspecial: produtoEditando.value.promocaoEspecial
  };
  if (produtoEditando.value._id) await produtosStore.atualizarProduto(produtoEditando.value._id, body);
  else await produtosStore.criarProduto(body);
  dialogEdicao.value = false;
  produtoEditando.value = estadoInicialProduto();
  await produtosStore.carregarProdutos();
}
async function removerProduto (id) {
  if (confirm('Deseja realmente excluir este produto?')) {
    await produtosStore.excluirProduto(id);
    await produtosStore.carregarProdutos();
  }
}

/* ---------- VARIAÇÕES ---------- */
function adicionarVariacao () {
  if (!Array.isArray(produtoEditando.value.variacoes)) produtoEditando.value.variacoes = [];
  produtoEditando.value.variacoes.push({ __id: gid(), cor: '', tamanho: '', estoque: 0, imagem: '' });
}
function removerVariacao (index) {
  if (!Array.isArray(produtoEditando.value.variacoes)) return;
  produtoEditando.value.variacoes.splice(index, 1);
}

/* ---------- Ações rápidas / Massa (PRESERVANDO IMAGENS) ---------- */
async function marcarComo (status, produto) {
  await atualizarProdutoPreservandoImagens(produto._id, { statusVenda: status });
  await produtosStore.carregarProdutos();
}
async function atualizarStatusSelecionados (status) {
  if (!produtosSelecionados.value.length) return;
  for (const id of produtosSelecionados.value) {
    await atualizarProdutoPreservandoImagens(id, { statusVenda: status });
  }
  produtosSelecionados.value = [];
  await produtosStore.carregarProdutos();
}
async function definirPromocao (produto) {
  const percStr = prompt(`Percentual de desconto para "${produto.descricaoProduto}"`, '10');
  const perc = Number(percStr || 0);
  if (isNaN(perc) || perc <= 0) return;
  await atualizarProdutoPreservandoImagens(produto._id, {
    promocao: { ativo: true, tipo: 'percentual', valor: perc, inicio: '', fim: '' }
  });
  await produtosStore.carregarProdutos();
}
async function definirPromocaoMassa () {
  if (!produtosSelecionados.value.length) return;
  const percStr = prompt('Entre com o percentual de desconto (ex: 15 para 15%):', '10');
  const perc = Number(percStr || 0);
  if (isNaN(perc) || perc <= 0) return;
  for (const id of produtosSelecionados.value) {
    await atualizarProdutoPreservandoImagens(id, {
      promocao: { ativo: true, tipo: 'percentual', valor: perc, inicio: '', fim: '' }
    });
  }
  produtosSelecionados.value = [];
  await produtosStore.carregarProdutos();
}

const promoEspecialMassa = ref({ nome: '', prioridade: 1, descontoExtra: 0, inicio: '', fim: '' });
function abrirPromocaoEspecialMassa () { dialogPromocaoEspecialMassa.value = true; }
async function aplicarPromocaoEspecialMassa () {
  if (!produtosSelecionados.value.length) return;
  for (const id of produtosSelecionados.value) {
    await atualizarProdutoPreservandoImagens(id, { promocaoEspecial: promoEspecialMassa.value });
  }
  dialogPromocaoEspecialMassa.value = false;
  produtosSelecionados.value = [];
  await produtosStore.carregarProdutos();
}

/* ---------- Edição rápida (PRESERVANDO IMAGENS) ---------- */
function abrirEdicaoRapida (p) {
  rapido.value = {
    _id: p._id,
    descricao: p.descricaoProduto,
    preco: Number(p.valorProduto || 0),
    status: p.statusVenda || 'Normal',
    promoAtiva: !!p.promocao?.ativo,
    promoTipo: p.promocao?.tipo || 'percentual',
    promoValor: Number(p.promocao?.valor || 0),
    promoInicio: p.promocao?.inicio || '',
    promoFim: p.promocao?.fim || ''
  };
  drawerEdicaoRapida.value = true;
}
async function aplicarEdicaoRapida () {
  const id = rapido.value._id;
  if (!id) return;
  const patch = {
    descricaoProduto: rapido.value.descricao,
    valorProduto: Number(rapido.value.preco || 0),
    statusVenda: rapido.value.status,
    promocao: {
      ativo: !!rapido.value.promoAtiva,
      tipo: rapido.value.promoTipo,
      valor: Number(rapido.value.promoValor || 0),
      inicio: rapido.value.promoInicio || '',
      fim: rapido.value.promoFim || ''
    }
  };
  await atualizarProdutoPreservandoImagens(id, patch);
  drawerEdicaoRapida.value = false;
  await produtosStore.carregarProdutos();
}

/* ---------- Imagens ---------- */
function obterUrlImagem (img) {
  if (!img) return '';
  if (typeof img.url === 'string' && img.url.startsWith('http')) return img.url;
  if (img.file instanceof File) return URL.createObjectURL(img.file);
  return img.url;
}
function removerImagem (index) { produtoEditando.value.imagensProdutos.splice(index, 1); }
function adicionarImagemPorUrl () {
  if (!novaImagemUrl.value) return;
  produtoEditando.value.imagensProdutos.push({ id: gid(), url: novaImagemUrl.value });
  novaImagemUrl.value = '';
}
async function handleFileUpload (event) {
  const files = Array.from(event.target?.files || []);
  for (const file of files) {
    const tempId = gid();
    const localUrl = URL.createObjectURL(file);
    produtoEditando.value.imagensProdutos.push({ id: tempId, url: localUrl, file });
    try {
      const uploadedImageUrl = await produtosStore.uploadImagem(file);
      const idx = produtoEditando.value.imagensProdutos.findIndex(img => img.id === tempId);
      if (idx !== -1) {
        produtoEditando.value.imagensProdutos[idx].url = uploadedImageUrl;
        delete produtoEditando.value.imagensProdutos[idx].file;
      }
    } catch {
      produtoEditando.value.imagensProdutos = produtoEditando.value.imagensProdutos.filter(img => img.id !== tempId);
    }
  }
}
function fecharDialogEdicao () { dialogEdicao.value = false; produtoEditando.value = estadoInicialProduto(); }

/* ---------- Tabela ---------- */
const headers = [
  { title: 'Produto', key: 'descricaoProduto', sortable: false },
  { title: 'Categoria', key: 'categoriaProduto' },
  { title: 'Preço', key: 'preco', sortable: false },
  { title: 'Estoque', key: 'estoque', value: (i) => estoqueTotal(i) },
  { title: 'Status', key: 'statusVenda' },
  { title: 'Promoções', key: 'promocao', sortable: false },
  { title: 'Ações', key: 'acoes', sortable: false, width: 140 },
];
</script>

<style scoped>
.sticky-actions {
  position: sticky;
  top: 0;
  z-index: 5;
  background: white;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
</style>
