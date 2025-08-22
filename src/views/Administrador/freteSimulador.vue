<template>
  <v-container>
    <!-- Cabeçalho -->
    <div class="d-flex align-center justify-space-between mb-4">
      <h2>Gestão de Fretes</h2>
      <div class="d-flex ga-2">
        <v-btn :loading="freteStore.loading" @click="listarFretes" color="primary" variant="elevated">
          <v-icon start>mdi-refresh</v-icon> Atualizar
        </v-btn>
        <v-btn color="success" @click="dialogCriar = true" variant="elevated">
          <v-icon start>mdi-plus</v-icon> Nova Cotação
        </v-btn>
      </div>
    </div>

    <!-- Feedback de Erro -->
    <v-alert
      v-if="freteStore.error"
      type="error"
      class="mb-4"
      variant="tonal"
      closable
    >
      {{ freteStore.error }}
    </v-alert>

    <!-- Lista de Fretes -->
    <v-skeleton-loader v-if="freteStore.loading && !freteStore.fretes.length" type="card" class="mb-4" />
    <v-card
      v-for="frete in freteStore.fretes"
      :key="frete._id"
      class="mb-4"
      elevation="1"
    >
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-3">
          <v-chip :color="statusColor(frete.status)" size="small" text-color="white">
            {{ frete.status || 'cotado' }}
          </v-chip>
          <span class="text-subtitle-1">ID: {{ frete._id }}</span>
        </div>

        <!-- Botões Desktop -->
        <div class="d-none d-sm-flex ga-2">
          <v-btn
  v-if="!frete.etiquetaId"
  size="small"
  color="primary"
  :disabled="!frete.cotacaoSelecionada || freteStore.carregando"
  @click="gerarEtiqueta(frete)"
>
  <v-icon start>mdi-label-outline</v-icon>
  Gerar Etiqueta
</v-btn>


          <v-btn
            v-else
            size="small"
            color="success"
            @click="abrirEtiqueta(frete)"
          >
            <v-icon start>mdi-open-in-new</v-icon>
            Abrir Etiqueta
          </v-btn>

          <v-btn
            size="small"
            color="error"
            @click="cancelarFrete(frete._id)"
          >
            <v-icon start>mdi-cancel</v-icon>
            Cancelar Frete
          </v-btn>
          <v-btn
            size="small"
            color="info"
            @click="frete._showDetalhes = !frete._showDetalhes"
          >
            <v-icon start>mdi-information-outline</v-icon>
            Detalhes
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text class="pt-0">
        <!-- Endereços -->
        <v-row class="mt-1">
          <v-col cols="12" sm="6">
            <div class="text-caption text-medium-emphasis">Origem</div>
            <div class="text-body-2">
              CEP: {{ frete.cepOrigem || '—' }}
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="text-caption text-medium-emphasis">Destino</div>
            <div class="text-body-2">
               CEP: {{ frete.cepDestino || '—' }}
            </div>
          </v-col>
        </v-row>

        <!-- Produtos -->
        <div class="mt-4">
          <div class="text-subtitle-2 mb-2">Produtos</div>
          <v-list density="compact" class="rounded">
            <v-list-item
              v-for="(p, i) in (frete.produtos || [])"
              :key="i"
              :title="p.nome || ('Produto ' + (i+1))"
              :subtitle="`${p.quantidade || 1}x ${p.peso || 0} g — ${p.largura || 0}x${p.altura || 0}x${p.comprimento || 0} cm`"
            >
              <template #prepend>
                <v-icon>mdi-package-variant-closed</v-icon>
              </template>
            </v-list-item>
            <v-list-item v-if="!(frete.produtos?.length)">
              <v-list-item-title>Nenhum produto informado</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Cotações -->
        <div class="mt-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-2">Cotações ({{ frete.cotacoes?.length || 0 }})</div>
            <v-chip
              v-if="frete.cotacaoSelecionada"
              color="teal"
              size="small"
              text-color="white"
              variant="elevated"
            >
              Selecionada: {{ frete.cotacaoSelecionada.carrier }} (R$ {{ frete.cotacaoSelecionada.valor }})
            </v-chip>
          </div>

          <v-list density="compact" class="rounded">
            <v-list-item
              v-for="cot in (frete.cotacoes || [])"
              :key="cot.id"
            >
              <template #prepend>
                <v-avatar size="28">
                  <v-icon>mdi-truck-fast</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>
                <strong>{{ cot.carrier }}</strong> — {{ cot.service }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Valor: R$ {{ cot.valor }} • Prazo: {{ cot.prazo }} dia(s)
              </v-list-item-subtitle>

              <template #append>
  <div class="d-flex ga-2">
    <v-btn
      size="x-small"
      color="success"
      :disabled="frete.cotacaoSelecionada?._id === cot._id"
      @click="selecionarCotacao(frete._id, cot._id)"
    >
      Selecionar
    </v-btn>
    <v-btn
      size="x-small"
      color="error"
      @click="cancelarCotacao(frete._id, cot._id)"
    >
      Cancelar
    </v-btn>
  </div>
</template>

            </v-list-item>

            <v-list-item v-if="!(frete.cotacoes?.length)">
              <v-list-item-title>Nenhuma cotação registrada</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Detalhes -->
        <v-expand-transition>
          <div v-show="frete._showDetalhes" class="mt-4">
            <v-divider class="mb-3" />
            <div class="text-subtitle-2 mb-1">Detalhes</div>
            <div class="text-body-2">
              <div><strong>Criado em:</strong> {{ formatDate(frete.createdAt) }}</div>
              <div v-if="frete.etiquetaId">
                <strong>Etiqueta:</strong>
                <v-btn small text color="primary" @click="abrirEtiqueta(frete)">
                  Abrir Etiqueta
                </v-btn>
                <div class="text-caption">{{ frete.etiquetaUrl }}</div>
              </div>
              <div><strong>Atualizado em:</strong> {{ formatDate(frete.updatedAt) }}</div>
              <div><strong>Usuário:</strong> {{ frete.usuario || '—' }}</div>
            </div>
          </div>
        </v-expand-transition>
      </v-card-text>

      <!-- Ações Mobile -->
      <v-card-actions class="d-flex d-sm-none ga-2">
        <v-btn
  v-if="!frete.etiqueta"
  size="small"
  color="primary"
  :disabled="!frete.cotacaoSelecionada || freteStore.loading"
  @click="gerarEtiqueta(frete._id.toString(), frete.cotacaoSelecionada?._id?.toString())"

>
  <v-icon start>mdi-label-outline</v-icon>
  Gerar Etiqueta
</v-btn>


        <v-btn
  v-else
  size="small"
  color="success"
  @click="abrirEtiqueta(frete)"
>
  <v-icon start>mdi-open-in-new</v-icon>
  Abrir Etiqueta
</v-btn>


        <v-btn
          size="small"
          color="error"
          @click="cancelarFrete(frete._id)"
        >
          <v-icon start>mdi-cancel</v-icon>
          Cancelar Frete
        </v-btn>

        <v-btn
          size="small"
          color="info"
          @click="frete._showDetalhes = !frete._showDetalhes"
        >
          <v-icon start>mdi-information-outline</v-icon>
          Detalhes
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-alert v-if="!freteStore.fretes.length && !freteStore.loading" type="info" variant="tonal">
      Nenhum frete encontrado. Crie sua primeira cotação no botão acima.
    </v-alert>

    <!-- Diálogo Criar Cotação -->
    <v-dialog v-model="dialogCriar" max-width="700">
      <v-card>
        <h2 class="mb-6">Simulação de Frete (Teste Automático)</h2>

        <v-btn color="info" class="mb-4" @click="preencherTeste">
          Preencher formulário de teste
        </v-btn>

        <v-form v-model="formValido" @submit.prevent="enviarCotacao">
          <!-- Campos e Produtos -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="cotacao.cepOrigem" label="CEP Origem" placeholder="00000-000" :rules="[v => !!v || 'CEP obrigatório']" required/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="cotacao.cepDestino" label="CEP Destino" placeholder="00000-000" :rules="[v => !!v || 'CEP obrigatório']" required/>
            </v-col>
          </v-row>

          <v-card class="pa-4 my-4">
            <h3 class="mb-3">Produtos</h3>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="produto.nome" label="Nome" />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field v-model.number="produto.peso" label="Peso (g)" type="number" min="1" />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field v-model.number="produto.quantidade" label="Qtd" type="number" min="1" />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field v-model.number="produto.altura" label="Altura (cm)" type="number" min="1" />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field v-model.number="produto.largura" label="Largura (cm)" type="number" min="1" />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field v-model.number="produto.comprimento" label="Comprimento (cm)" type="number" min="1" />
              </v-col>
            </v-row>

            <v-btn color="primary" class="mt-3" @click="adicionarProduto" :disabled="!produto.nome || !produto.peso">
              Adicionar Produto
            </v-btn>

            <v-list v-if="cotacao.produtos.length" class="mt-4">
              <v-list-item v-for="(p, i) in cotacao.produtos" :key="i">
                <v-list-item-title>
                  {{ p.nome }} - {{ p.quantidade }}x ({{ p.peso }} g)
                  [{{ p.altura }}x{{ p.largura }}x{{ p.comprimento }} cm]
                </v-list-item-title>
                <template #append>
                  <v-btn icon @click="removerProduto(i)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card>

          <!-- Opções de envio -->
          <v-card class="pa-4 my-4">
            <h3 class="mb-3">Opções de Envio</h3>
            <v-text-field v-model="cotacao.services" label="Serviços (ex: 1,2,17)" />
            <v-checkbox v-model="cotacao.options.own_hand" label="Mão própria" />
            <v-checkbox v-model="cotacao.options.receipt" label="Aviso de recebimento" />
            <v-text-field v-model.number="cotacao.options.insurance_value" label="Valor do seguro" type="number" min="0" />
          </v-card>

          <v-btn type="submit" color="success" :loading="freteStore.carregando" :disabled="!formValido || !cotacao.produtos.length">
            Criar Cotação
          </v-btn>
        </v-form>

        <v-card v-if="resultado" class="mt-6 pa-4">
          <h3>Resultado da Cotação</h3>
          <pre>{{ resultado }}</pre>
        </v-card>

        <v-alert v-if="freteStore.erro" type="error" class="mt-4">
          {{ freteStore.erro }}
        </v-alert>
      </v-card>
    </v-dialog>
</v-container>
</template>


<script setup>

import { ref, reactive, onMounted } from 'vue'
import { useFreteStore } from '@/store/freteStore'

const freteStore = useFreteStore()
const formValido = ref(false)
const resultado = ref(null)

// Cotação
const cotacao = reactive({
  cepOrigem: "",
  cepDestino: "",
  produtos: [],
  services: "1,2,17",
  options: {
    own_hand: false,
    receipt: false,
    insurance_value: 0,
    use_insurance_value: false
  }
})

// Produto temporário para adicionar à cotação
const produto = reactive({
  nome: "",
  peso: null,
  quantidade: 1,
  altura: null,
  largura: null,
  comprimento: null
})

// Diálogo
const dialogCriar = ref(false)

// --- Funções Cotação ---
function adicionarProduto() {
  if (!produto.nome || !produto.peso) return
  cotacao.produtos.push({ ...produto })
  Object.assign(produto, { nome: "", peso: null, quantidade: 1, altura: null, largura: null, comprimento: null })
}

function removerProduto(index) {
  cotacao.produtos.splice(index, 1)
}

function preencherTeste() {
  cotacao.cepOrigem = "09351080"
  cotacao.cepDestino = "09541360"
  cotacao.services = "1,2,17"
  cotacao.options.own_hand = false
  cotacao.options.receipt = false
  cotacao.options.insurance_value = 50
  cotacao.options.use_insurance_value = true

  cotacao.produtos = [
    { nome: "Camisetas", peso: 500, quantidade: 2, altura: 20, largura: 20, comprimento: 10 },
    { nome: "Tênis", peso: 800, quantidade: 1, altura: 30, largura: 25, comprimento: 35 }
  ]

  // Endereços de teste
  cotacao.enderecoOrigem = {
    nome: "Loja Teste",
    endereco: "Rua A",
    numero: "123",
    bairro: "Centro",
    cidade: "Mauá",
    estado: "SP",
    cep: "09351080",
    cpfCnpj: "12345678900"
  }
  cotacao.enderecoDestino = {
    nome: "João da Silva",
    endereco: "Rua B",
    numero: "456",
    bairro: "Jardim",
    cidade: "São Caetano",
    estado: "SP",
    cep: "09541360",
    cpfCnpj: "98765432100"
  }
}


async function enviarCotacao() {
  if (!cotacao.produtos.length) return

  try {
    const data = await freteStore.criarCotacao(cotacao)
    if (data) resultado.value = data
  } catch (err) {
    console.error("Erro ao enviar cotação:", err)
  }
}

// --- Funções Frete ---
async function listarFretes() {
  await freteStore.listarTodosFretes()
}

async function selecionarCotacao(freteId, cotacaoId) {
  await freteStore.selecionarCotacao(freteId, cotacaoId)
  await listarFretes()
}

async function gerarEtiqueta(freteId, cotacaoId) {
  const etiqueta = await freteStore.gerarEtiqueta(freteId, cotacaoId)
  if (etiqueta?.url || etiqueta?.etiquetaUrl) {
    window.open(etiqueta.url || etiqueta.etiquetaUrl, "_blank")
  }
}


function abrirEtiqueta(frete) {
  if (frete.etiquetaUrl) window.open(frete.etiquetaUrl, "_blank")
}

async function cancelarFrete(freteId) {
  await freteStore.cancelarFrete(freteId)
  await listarFretes()
}

async function cancelarCotacao(freteId, cotacaoId) {
  await freteStore.cancelarCotacao(freteId, cotacaoId)
  await listarFretes()
}

// --- Helpers ---
function statusColor(status) {
  switch (status) {
    case 'etiqueta_gerada': return 'green'
    case 'cancelado': return 'red'
    case 'pendente': return 'orange'
    default: return 'blue'
  }
}

function formatDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleString() } catch { return d }
}

// --- On Mounted ---
onMounted(async () => {
  await listarFretes()
  console.log('FRETES:', JSON.parse(JSON.stringify(freteStore.fretes)))
})
</script>
