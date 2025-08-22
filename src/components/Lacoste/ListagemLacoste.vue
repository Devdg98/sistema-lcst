<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="produto in produtos"
        :key="produto._id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="ma-2" elevation="3">
          <v-img
            :src="produto.imagensProdutos[0]"
            height="200px"
            cover
            v-if="produto.imagensProdutos.length > 0"
          ></v-img>

          <v-card-title>{{ produto.descricaoProduto }}</v-card-title>

          <v-card-subtitle class="text-primary">
            {{ formatarValor(produto.valorProduto) }}
            <span
              v-if="produto.valorDesconto"
              class="text-error text-decoration-line-through text-sm ml-2"
            >
              {{ formatarValor(produto.valorDesconto) }}
            </span>
          </v-card-subtitle>

          <v-card-text>
            <p><strong>Marca:</strong> {{ produto.marcaProduto }}</p>
            <p><strong>Categoria:</strong> {{ produto.categoriaProduto }}</p>
            <p><strong>Gênero:</strong> {{ produto.generoProduto }}</p>
          </v-card-text>

          <v-card-actions>
            <v-btn>Abrir Pagina</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="produtos.length === 0">
      <v-col cols="12" class="text-center">
        <v-alert type="info" border="start" variant="tonal">
          Nenhum produto encontrado.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const produtos = ref([])

const carregarProdutos = async () => {
  try {
    const res = await fetch('http://localhost:2999/produtos')
    if (!res.ok) throw new Error('Erro ao carregar produtos')
    const data = await res.json()
    produtos.value = data
  } catch (err) {
    console.error('Erro ao buscar produtos:', err.message)
  }
}

const formatarValor = (valor) => {
  if (!valor) return ''
  return parseFloat(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

onMounted(() => {
  carregarProdutos()
})
</script>

<style scoped>
.v-card-title {
  font-weight: 600;
  font-size: 1.1rem;
}
</style>
