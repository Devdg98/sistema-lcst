<template>
  <v-container class="pa-4">
    <h1>Finalizar Compra</h1>

    <!-- Lista de itens -->
    <v-card class="mb-4" v-if="carrinho.itens.length">
      <v-list>
        <v-list-item
          v-for="(item, index) in carrinho.itens"
          :key="index"
        >
          <v-list-item-avatar size="64">
            <v-img :src="obterUrlImagem(item.produto.imagensProdutos[0])" cover />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ item.produto.descricaoProduto }}</v-list-item-title>
            <v-list-item-subtitle>
              Cor: {{ item.cor }} | Tamanho: {{ item.tamanho }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            {{ formatarPreco(item.produto.valorProduto) }} x {{ item.quantidade }}
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Erro -->
    <v-alert type="error" v-if="checkout.erro" class="mb-4">
      {{ checkout.erro }}
    </v-alert>

    <!-- Botão de pagamento -->
    <v-btn
      color="primary"
      block
      :loading="checkout.loading"
      @click="checkout.iniciarCheckout"
    >
      Ir para pagamento
    </v-btn>

    <!-- Se já tiver initPoint -->
    <div v-if="checkout.initPoint" class="mt-4">
      <v-btn
        color="success"
        block
        :href="checkout.initPoint"
        target="_blank"
      >
        Finalizar no Mercado Pago
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { useCarrinhoStore } from '@/store/carrinho'
import { useCheckoutStore } from '@/store/checkout'

const carrinho = useCarrinhoStore()
const checkout = useCheckoutStore()

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function obterUrlImagem(imagem) {
  return imagem?.url || imagem
}
</script>
