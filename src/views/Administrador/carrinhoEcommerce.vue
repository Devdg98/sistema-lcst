<template>
  <!-- STEPPER -->
  <v-container class="bg-blue-grey-lighten-5 pa-0">
    <v-stepper v-model="passoAtual" class="checkout-stepper pa-0 mt-n6">
      
      <!-- Cabeçalho do Stepper -->
      <v-stepper-header class="checkout-header">
        <v-stepper-item :value="1" title="Sacola" color="#002D18" class="checkout-item"/>
        <v-stepper-item :value="2" title="Entrega" color="#002D18" class="checkout-item"/>
        <v-stepper-item :value="3" title="Pagamento" color="#002D18" class="checkout-item"/>
      </v-stepper-header>

      <!-- Conteúdo das etapas -->
      <v-stepper-window class="flex-grow-1 overflow-y-auto">

        <!-- Etapa 1 - Sacola -->
        <v-stepper-window-item :value="1">
          <v-container class="pa-0">
            <v-row v-for="(item, index) in carrinho.itens" :key="index" no-gutters class="pa-0">
              <v-col cols="12">
                <div class="d-flex justify-start align-center" style="width: 100%;">
                  <v-img
                    :src="obterUrlImagem(item.produto.imagensProdutos[0])"
                    height="150"
                    width="100"
                    cover
                  />
                  <div class="d-flex flex-column" style="flex-grow: 1; margin-left: 16px;">
                    <div class="d-flex justify-space-between align-start">
                      <div class="descricaoTitulo mr-4">{{ item.produto.descricaoProduto }}</div>
                      <v-btn icon elevation="0" @click="removerItem(index)">
                        <v-icon color="black">mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <div class="CorTamanho2">{{ item.cor }}</div>
                    <div class="CorTamanho">Tamanho: {{ item.tamanho }}</div>
                    <div class="valorProduto">{{ formatarPreco(item.produto.valorProduto) }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>

          <v-card elevation="2">
            <v-card-text>
              <div class="corTamanho">
                Entrega: {{ frete.servico || '---' }} ({{ frete.prazoEntrega || '--' }} dias)
              </div>
              <div class="valorProduto">TOTAL: {{ formatarPreco(totalPedido) }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn block class="btn-lacoste" @click="passoAtual = 2">Continuar</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>

        <!-- Etapa 2 - Endereço -->
        <v-stepper-window-item :value="2">
          <v-container>
            <v-card-title class="tituloEntrega pa-0">Entrega</v-card-title>

            <v-row align="center" class="pa-0">
              <v-col cols="2" sm="4" class="d-flex justify-end pa-0 mt-2">
                <v-checkbox v-model="entregaPadraoSelecionada" hide-details></v-checkbox>
              </v-col>
              <v-col cols="10" sm="8" class="d-flex align-center">
                <v-card-text class="pa-0">ENTREGA PADRÃO - 3 a 7 DIAS ÚTEIS</v-card-text>
              </v-col>
            </v-row>
          </v-container>

          <v-card flat>
            <v-card-title class="tituloEntrega">Selecione um endereço</v-card-title>
            <v-card-text>
              <v-radio-group v-model="enderecoSelecionado">
                <v-radio
                  v-for="e in enderecoStore.enderecos"
                  :key="e._id"
                  :label="`${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade}`"
                  :value="e._id"
                />
              </v-radio-group>

              <v-divider class="my-4" />
              <p class="mb-2">Adicionar novo endereço</p>

              <v-text-field v-model="endereco.rua" label="Rua" variant="outlined" density="compact"/>
              <v-text-field v-model="endereco.numero" label="Número" variant="outlined" density="compact"/>
              <v-text-field v-model="endereco.complemento" label="Complemento" variant="outlined" density="compact"/>
              <v-text-field v-model="endereco.bairro" label="Bairro" variant="outlined" density="compact"/>
              <v-text-field v-model="endereco.cidade" label="Cidade" variant="outlined" density="compact"/>
              <v-text-field v-model="endereco.estado" label="Estado" variant="outlined" density="compact"/>
              <v-text-field v-model="endereco.cep" label="CEP" variant="outlined" density="compact"/>

              <v-btn block class="mt-2 btn-lacoste" @click="salvarEndereco">Salvar Endereço</v-btn>
            </v-card-text>
          </v-card>

          <v-container elevation="2" class="pa-4">
            <v-card-text>
              <div class="corTamanho">
                Entrega: {{ frete.servico || '---' }} ({{ frete.prazoEntrega || '--' }} dias)
              </div>
              <div class="valorProduto">TOTAL: {{ formatarPreco(totalPedido) }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn block class="btn-lacoste" @click="passoAtual = 3">Continuar</v-btn>
            </v-card-actions>
          </v-container>
        </v-stepper-window-item>

        <!-- Etapa 3 - Pagamento -->
        <v-stepper-window-item :value="3">
          <v-container class="pa-2">
            <v-card class="mb-4" v-if="carrinho.itens.length">
              <v-list>
                <v-list-item v-for="(item, index) in carrinho.itens" :key="index">
                  <v-list-item-avatar size="64">
                    <v-img :src="obterUrlImagem(item.produto.imagensProdutos[0])" cover/>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.produto.descricaoProduto }}</v-list-item-title>
                    <v-list-item-subtitle>Cor: {{ item.cor }} | Tamanho: {{ item.tamanho }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    {{ formatarPreco(item.produto.valorProduto) }} x {{ item.quantidade }}
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>

            <v-alert type="error" v-if="checkout.erro" class="mb-4">{{ checkout.erro }}</v-alert>

            <v-btn color="primary" block :loading="checkout.loading" @click="checkout.iniciarCheckout">
              Ir para pagamento
            </v-btn>

            <div v-if="checkout.initPoint" class="mt-4">
              <v-btn color="success" block :href="checkout.initPoint" target="_blank">
                Finalizar no Mercado Pago
              </v-btn>
            </div>
          </v-container>
        </v-stepper-window-item>

      </v-stepper-window>
    </v-stepper>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useCarrinhoStore } from "@/store/carrinho";
import { useCheckoutStore } from "@/store/checkout";
import { useEnderecoStore } from "@/store/endereco";
import { useAuthStore } from "@/store/auth";
import axios from "axios";

const carrinho = useCarrinhoStore();
const checkout = useCheckoutStore();
const enderecoStore = useEnderecoStore();
const auth = useAuthStore();

const passoAtual = ref(1);
const enderecoSelecionado = ref(null);
const endereco = ref({
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: ""
});
const frete = ref({ valor: 0, prazoEntrega: null, servico: '' });
const entregaPadraoSelecionada = ref(true);

const totalPedido = computed(() => {
  const subtotal = carrinho.itens.reduce((acc, item) => acc + item.quantidade * item.produto.valorProduto, 0);
  return subtotal + (frete.value.valor || 0);
});

onMounted(() => {
  if (auth.usuario?._id) {
    enderecoStore.carregarEnderecos(auth.usuario._id);
  }
});

async function salvarEndereco() {
  try {
    const novoEndereco = await enderecoStore.adicionarEndereco({
      usuarioId: auth.usuario._id,
      ...endereco.value
    });
    enderecoSelecionado.value = novoEndereco._id;
    endereco.value = { rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", cep: "" };
    await calcularFrete(novoEndereco.cep);
  } catch (e) {
    console.error("Erro ao salvar endereço", e);
  }
}

watch(enderecoSelecionado, async (novoId) => {
  if (!novoId) return;
  const e = enderecoStore.enderecos.find(e => e._id === novoId);
  if (e) await calcularFrete(e.cep);
});

async function calcularFrete(cepDestino) {
  if (!checkout.pedidoId) return;
  try {
    const { data } = await axios.post(
      'http://192.168.18.136:2998/frete/calcular',
      { pedidoId: checkout.pedidoId, cepDestino },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    frete.value = { valor: data.valor, prazoEntrega: data.prazoEntrega, servico: data.servico };
  } catch (err) {
    console.error("Erro ao calcular frete", err.response?.data || err.message);
  }
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function obterUrlImagem(imagem) {
  if (!imagem) return "";
  return typeof imagem === "string" ? imagem : imagem.url;
}

function removerItem(index) {
  carrinho.removerItem(index);
}
</script>

<style scoped>
.checkout-header { background-color: #f5f5f5; border-bottom: 1px solid #ddd; }
.checkout-item { font-weight: bold; color: #002D18 !important; }
.btn-lacoste { background-color: #002D18 !important; color: white !important; font-weight: bold; border-radius: 0; text-transform: uppercase; }
.btn-lacoste:hover { opacity: 0.9; }
.valorProduto { font-weight: 500; font-size: 16px; color: #002D18; }
.CorTamanho, .CorTamanho2 { font-weight: 400; font-size: 16px; color: #002D18; }
.descricaoTitulo { font-weight: bold; color: #002D18; }
.tituloEntrega { font-weight: 400; color: #002D18; }
.titulo-revisao { font-weight: bold; color: #002D18; }
.endereco-revisao { margin-top: 10px; font-size: 0.95rem; }
</style>
