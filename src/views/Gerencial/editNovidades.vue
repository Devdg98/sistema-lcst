<!-- src/components/BannersNovidades.vue -->
<template>
  <v-container class="pa-2 mt-n6">
    <div class="d-flex align-center mb-4">
      <h2 class="text-h5 font-weight-bold mb-0">Novidades</h2>
      <v-spacer />
      <v-btn size="small" variant="text" @click="recarregar" :loading="loading">
        <v-icon start>mdi-refresh</v-icon> Atualizar
      </v-btn>
    </div>

    <v-alert
      v-if="erro"
      type="error"
      variant="tonal"
      class="mb-3"
    >
      {{ erro }}
    </v-alert>

    <v-row v-if="loading">
      <v-col v-for="n in 3" :key="n" cols="12" md="6" lg="6">
        <v-skeleton-loader type="image"></v-skeleton-loader>
      </v-col>
    </v-row>

    <template v-else>
      <v-alert
        v-if="novidades.length === 0"
        type="info"
        variant="tonal"
        class="mb-3"
      >
        Nenhum banner de <strong>Novidades</strong> cadastrado ainda.
      </v-alert>

      <v-row>
        <v-col
          v-for="(bn, i) in novidades"
          :key="bn._id || i"
          cols="12"
          md="6"
          lg="6"
        >
          <RouterLink :to="rotaDe(bn)" style="text-decoration:none">
            <v-img
              :src="primeiraImagem(bn)"
              cover
              class="position-relative rounded-0"
              height="400"
            >
              <div class="sale-overlay d-flex flex-column align-center justify-end text-center px-4 pb-4">
                <h3 class="sale-title">{{ bn.tituloProduto || 'NOVIDADES' }}</h3>
                <p class="sale-subtitle">{{ bn.subtituloProduto || 'Confira as novidades' }}</p>
                <v-btn icon variant="outlined" color="white" size="small" class="mt-2 sale-btn">
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-img>
          </RouterLink>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBannerStore } from '@/store/bannerStore'

const store = useBannerStore()

const loading = computed(() => store.loading)
const erro = computed(() => store.error)

// ativo global (se existir e for "Novidades", ele ganha prioridade)
const ativoNovidade = computed(() => {
  const a = store.ativo
  if (!a) return null
  return String(a.tituloProduto || '').trim().toLowerCase() === 'novidades' ? a : null
})

// fallback: pega o mais recente com tituloProduto === 'Novidades'
const fallbackNovidade = computed(() => {
  const lista = (store.produtos || [])
    .filter(p => String(p.tituloProduto || '').trim().toLowerCase() === 'novidades')
  return lista[0] || null
})

const novidades = computed(() => {
  const preferido = ativoNovidade.value || fallbackNovidade.value
  return preferido ? [preferido] : []
})

function primeiraImagem(bn) {
  const lista = Array.isArray(bn.imagensProdutos) ? bn.imagensProdutos : []
  return lista[0] || 'https://via.placeholder.com/1200x600?text=Sem+Imagem'
}

function rotaDe(bn) {
  const s = String(bn.subtituloProduto || '').trim()
  if (s.startsWith('/')) return s
  return '/novidades'
}

function recarregar() {
  store.carregarProdutos()
  store.carregarAtivo()
}

onMounted(() => {
  if (!store.produtos.length) store.carregarProdutos()
  store.carregarAtivo()
})
</script>


<style scoped>
.sale-overlay {
  position: absolute;
  inset: auto 0 0 0;
  background-color: rgba(0, 0, 0, 0.62);
  padding: 12px;
}
.sale-title {
  color: #fff;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0;
  text-transform: uppercase;
}
.sale-subtitle {
  color: #eee;
  font-size: 0.9rem;
  margin-bottom: 8px;
}
.sale-btn {
  border-radius: 0 !important;
  border-color: white !important;
}
</style>
