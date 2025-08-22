<template>
  <v-container>
    <h2 class="mb-6">Simulação de Frete (Teste Automático)</h2>

    <v-btn color="info" class="mb-4" @click="preencherTeste">
      Preencher formulário de teste
    </v-btn>

    <v-form v-model="formValido" @submit.prevent="enviarCotacao">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="cotacao.cepOrigem"
            label="CEP Origem"
            placeholder="00000-000"
            :rules="[v => !!v || 'CEP obrigatório']"
            required
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="cotacao.cepDestino"
            label="CEP Destino"
            placeholder="00000-000"
            :rules="[v => !!v || 'CEP obrigatório']"
            required
          />
        </v-col>
      </v-row>

      <!-- Produtos -->
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

    <!-- Resultado -->
    <v-card v-if="resultado" class="mt-6 pa-4">
      <h3>Resultado da Cotação</h3>
      <pre>{{ resultado }}</pre>
    </v-card>

    <!-- Erro -->
    <v-alert v-if="freteStore.erro" type="error" class="mt-4">
      {{ freteStore.erro }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useFreteStore } from "@/store/storeFrete";

const freteStore = useFreteStore();
const formValido = ref(false);
const resultado = ref(null);

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
});

const produto = reactive({
  nome: "",
  peso: null,
  quantidade: 1,
  altura: null,
  largura: null,
  comprimento: null
});

function adicionarProduto() {
  if (!produto.nome || !produto.peso) return;
  cotacao.produtos.push({ ...produto });
  Object.assign(produto, { nome: "", peso: null, quantidade: 1, altura: null, largura: null, comprimento: null });
}

function removerProduto(index) {
  cotacao.produtos.splice(index, 1);
}

// Preenche o formulário automaticamente para teste
function preencherTeste() {
  cotacao.cepOrigem = "09351080";
  cotacao.cepDestino = "09541360";
  cotacao.services = "1,2,17";
  cotacao.options.own_hand = false;
  cotacao.options.receipt = false;
  cotacao.options.insurance_value = 50;
  cotacao.options.use_insurance_value = true;

  cotacao.produtos = [
    { nome: "Camisetas", peso: 500, quantidade: 2, altura: 20, largura: 20, comprimento: 10 },
    { nome: "Tênis", peso: 800, quantidade: 1, altura: 30, largura: 25, comprimento: 35 }
  ];
}

async function enviarCotacao() {
  if (!cotacao.produtos.length) return;

  try {
    const data = await freteStore.criarCotacao(cotacao);
    if (data) resultado.value = data;
  } catch (err) {
    console.error("Erro ao enviar cotação:", err);
  }
}
</script>
