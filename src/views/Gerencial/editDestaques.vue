<template>
  <v-container class="pa-4">
    <div class="d-flex align-center mb-4">
      <h2 class="text-h5 font-weight-bold mb-0">Banners</h2>
      <v-spacer />
      <!-- Agora abre o modal + mantém o emit -->
      <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirNovo">
        Novo Banner
      </v-btn>
      <v-btn class="ml-2" variant="text" :loading="store.loading" @click="recarregar">
        <v-icon start>mdi-refresh</v-icon> Atualizar
      </v-btn>
    </div>

    <div class="d-flex align-center mb-3">
      <v-tabs v-model="categoria" density="comfortable" class="mr-4">
        <v-tab value="Novidades">Novidades</v-tab>
        <v-tab value="Destaques">Destaques</v-tab>
        <v-tab value="Promoções">Promoções</v-tab>
      </v-tabs>

      <v-spacer />

      <v-btn-toggle v-model="modo" density="comfortable" mandatory>
        <v-btn value="cards" icon><v-icon>mdi-view-grid</v-icon></v-btn>
        <v-btn value="lista" icon><v-icon>mdi-view-list</v-icon></v-btn>
      </v-btn-toggle>
    </div>

    <v-alert v-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <!-- Skeleton -->
    <v-row v-if="store.loading">
      <v-col v-for="n in 6" :key="n" cols="12" md="6" lg="4">
        <v-skeleton-loader type="image, text"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Sem dados -->
    <v-alert
      v-else-if="filtrados.length === 0"
      type="info"
      variant="tonal"
      class="mb-3"
    >
      Nenhum banner em <strong>{{ categoria }}</strong> ainda.
    </v-alert>

    <!-- Cards -->
    <template v-else-if="modo === 'cards'">
      <v-row>
        <v-col
          v-for="item in filtrados"
          :key="item._id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="elevation-1 overflow-hidden">
            <div class="position-relative">
              <v-img
                :src="primeiraImagem(item)"
                height="220"
                cover
              />
              <v-chip
                v-if="item.isActive"
                class="pos-chip"
                color="green"
                size="small"
                variant="flat"
              >
                Ativo
              </v-chip>
            </div>

            <v-card-text class="py-3">
              <div class="text-caption text-grey">{{ item.tituloProduto }}</div>
              <div class="text-subtitle-1 font-weight-600">{{ item.subtituloProduto }}</div>
              <div class="d-flex flex-wrap mt-2 gap-2">
                <v-avatar
                  v-for="(url,i) in (item.imagensProdutos||[]).slice(0,4)"
                  :key="i"
                  size="36"
                >
                  <v-img :src="url" />
                </v-avatar>
                <span v-if="!(item.imagensProdutos||[]).length" class="text-grey">Sem imagens</span>
              </div>
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn size="small" variant="text" color="teal" @click="abrirEdicao(item)">
                <v-icon start size="16">mdi-pencil</v-icon> Editar
              </v-btn>
              <v-btn
                size="small"
                variant="text"
                color="green"
                :disabled="item.isActive"
                @click="ativar(item)"
              >
                <v-icon start size="16">mdi-check-circle</v-icon> Ativar
              </v-btn>
              <v-btn
                size="small"
                variant="text"
                color="grey"
                :disabled="!item.isActive"
                @click="desativar(item)"
              >
                <v-icon start size="16">mdi-close-circle</v-icon> Desativar
              </v-btn>
              <v-btn size="small" variant="text" color="error" @click="excluir(item)">
                <v-icon start size="16">mdi-delete</v-icon> Excluir
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Lista -->
    <template v-else>
      <v-data-table
        :headers="headers"
        :items="filtrados"
        item-key="_id"
        density="comfortable"
      >
        <template v-slot:[`item.isActive`]="{ item }">
          <v-chip :color="item.isActive ? 'green' : 'grey'" size="small" variant="flat">
            {{ item.isActive ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template v-slot:[`item.imagensProdutos`]="{ item }">
          <div class="d-flex align-center">
            <v-avatar v-if="(item.imagensProdutos||[]).length" size="40" class="mr-2">
              <v-img :src="item.imagensProdutos[0]" />
            </v-avatar>
            <span v-else class="text-grey">—</span>
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn size="x-small" variant="text" color="teal" @click="abrirEdicao(item)">
            <v-icon start size="16">mdi-pencil</v-icon> Editar
          </v-btn>
          <v-btn
            size="x-small"
            variant="text"
            color="green"
            :disabled="item.isActive"
            @click="ativar(item)"
          >
            <v-icon start size="16">mdi-check-circle</v-icon> Ativar
          </v-btn>
          <v-btn
            size="x-small"
            variant="text"
            color="grey"
            :disabled="!item.isActive"
            @click="desativar(item)"
          >
            <v-icon start size="16">mdi-close-circle</v-icon> Desativar
          </v-btn>
          <v-btn size="x-small" variant="text" color="error" @click="excluir(item)">
            <v-icon start size="16">mdi-delete</v-icon> Excluir
          </v-btn>
        </template>
      </v-data-table>
    </template>

    <!-- Dialogo de Formulário (Criar/Editar) -->
    <v-dialog v-model="dialog" max-width="720">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-image-multiple</v-icon>
          {{ editando ? 'Editar Banner' : 'Novo Banner' }}
          <v-spacer />
          <v-btn icon variant="text" @click="dialog=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-form ref="formRef" @submit.prevent="salvar">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.tituloProduto"
                  :items="['Novidades','Destaques','Promoções']"
                  label="Categoria (Título)"
                  :rules="[v=>!!v || 'Selecione uma categoria']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.subtituloProduto"
                  label="Subtítulo"
                  :rules="[v=>!!v || 'Informe um subtítulo']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-switch
                  v-model="form.isActive"
                  color="green"
                  inset
                  label="Ativo"
                  hint="Apenas 1 ativo por categoria"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" class="pt-0">
                <div class="mb-2 d-flex align-center">
                  <div class="text-subtitle-2">Imagens</div>
                  <v-spacer />
                  <v-btn size="small" variant="tonal" prepend-icon="mdi-upload" @click="inputFile?.click()" :loading="uploading">
                    Enviar imagem
                  </v-btn>
                  <input ref="inputFile" type="file" accept="image/*" class="d-none" @change="onPickFile" />
                </div>

                <v-row>
                  <v-col
                    v-for="(url, i) in form.imagensProdutos"
                    :key="i"
                    cols="12" sm="6" md="4"
                  >
                    <v-card class="elevation-1">
                      <v-img :src="url" height="160" cover />
                      <v-card-actions class="justify-end">
                        <v-btn size="x-small" variant="text" color="error" @click="removerImagem(i)">
                          <v-icon start size="16">mdi-delete</v-icon> Remover
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>

                  <v-col v-if="!form.imagensProdutos.length" cols="12">
                    <v-alert type="info" variant="tonal">
                      Nenhuma imagem adicionada ainda.
                    </v-alert>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="dialog=false">Cancelar</v-btn>
          <v-btn color="primary" :loading="salvando" @click="salvar">
            <v-icon start>mdi-content-save</v-icon> Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snack.show" :timeout="3000" :color="snack.color">
      <v-icon start>{{ snack.color==='red' ? 'mdi-alert' : 'mdi-check' }}</v-icon>
      {{ snack.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBannerStore } from '@/store/bannerStore' // mantém sua store

/* global defineEmits */             // <-- AVISA O ESLINT
// ou, apenas na linha:
//// eslint-disable-next-line no-undef
const emit = defineEmits(['novo-banner','editar'])
const store = useBannerStore()

const categoria = ref('Novidades') // Novidades | Destaques | Promoções
const modo = ref('cards')          // cards | lista

const headers = [
  { title: 'Ativo', key: 'isActive', sortable: false, width: 90 },
  { title: 'Título', key: 'tituloProduto' },
  { title: 'Subtítulo', key: 'subtituloProduto' },
  { title: 'Imagem', key: 'imagensProdutos', sortable: false, width: 120 },
  { title: 'Ações', key: 'actions', sortable: false, width: 320 },
]

const filtrados = computed(() => {
  const cat = categoria.value.toLowerCase()
  return (store.produtos || []).filter(p =>
    String(p.tituloProduto || '').trim().toLowerCase() === cat
  )
})

function primeiraImagem(bn) {
  const arr = Array.isArray(bn.imagensProdutos) ? bn.imagensProdutos : []
  return arr[0] || 'https://via.placeholder.com/1200x600?text=Sem+Imagem'
}

function recarregar() {
  store.carregarProdutos()
  if (store.carregarAtivo) store.carregarAtivo()
}

async function ativar(item) {
  try {
    if (!store.ativar) throw new Error('Método store.ativar não encontrado')
    await store.ativar(item._id)
    await store.carregarProdutos()
    snack.value = { show: true, text: 'Banner ativado', color: 'success' }
  } catch (e) {
    snack.value = { show: true, text: (e?.error || e?.message || 'Erro ao ativar'), color: 'red' }
  }
}

async function desativar(item) {
  try {
    if (!store.desativar) throw new Error('Método store.desativar não encontrado')
    await store.desativar(item._id)
    await store.carregarProdutos()
    snack.value = { show: true, text: 'Banner desativado', color: 'success' }
  } catch (e) {
    snack.value = { show: true, text: (e?.error || e?.message || 'Erro ao desativar'), color: 'red' }
  }
}

async function excluir(item) {
  if (!confirm(`Excluir o banner "${item.subtituloProduto}"?`)) return
  await store.excluirProduto(item._id)
  snack.value = { show: true, text: 'Banner excluído', color: 'success' }
}

/* ====== Formulário (criar/editar) ====== */
const dialog = ref(false)
const editando = ref(false)
const salvando = ref(false)
const uploading = ref(false)
const formRef = ref(null)
const inputFile = ref(null)

const form = ref({
  _id: null,
  tituloProduto: '',
  subtituloProduto: '',
  imagensProdutos: [],
  isActive: false,
})

function resetForm() {
  form.value = {
    _id: null,
    tituloProduto: categoria.value || 'Novidades',
    subtituloProduto: '',
    imagensProdutos: [],
    isActive: false,
  }
  editando.value = false
}

function abrirNovo() {
  resetForm()
  dialog.value = true
  emit('novo-banner') // mantém seu emit original
}

function abrirEdicao(item) {
  form.value = {
    _id: item._id,
    tituloProduto: item.tituloProduto || '',
    subtituloProduto: item.subtituloProduto || '',
    imagensProdutos: [...(item.imagensProdutos || [])],
    isActive: !!item.isActive,
  }
  editando.value = true
  dialog.value = true
  emit('editar', item) // mantém seu emit original
}

function removerImagem(index) {
  form.value.imagensProdutos.splice(index, 1)
}

async function onPickFile(e) {
  const file = e?.target?.files?.[0]
  if (!file) return
  try {
    uploading.value = true
    const url = await store.uploadImagem(file)
    if (url) {
      form.value.imagensProdutos.push(url)
      snack.value = { show: true, text: 'Imagem enviada', color: 'success' }
    } else {
      snack.value = { show: true, text: 'Falha ao enviar imagem', color: 'red' }
    }
  } finally {
    uploading.value = false
    if (inputFile.value) inputFile.value.value = ''
  }
}

async function salvar() {
  const ok = await formRef.value?.validate()
  if (ok === false) return
  salvando.value = true
  try {
    if (editando.value && form.value._id) {
      // UPDATE
      const payload = {
        tituloProduto: form.value.tituloProduto,
        subtituloProduto: form.value.subtituloProduto,
        imagensProdutosExistentes: form.value.imagensProdutos, // compat c/ seu controller
        isActive: form.value.isActive,
      }
      await store.atualizarProduto(form.value._id, payload)
      snack.value = { show: true, text: 'Banner atualizado', color: 'success' }
    } else {
      // CREATE
      const payload = {
        tituloProduto: form.value.tituloProduto,
        subtituloProduto: form.value.subtituloProduto,
        imagensProdutos: form.value.imagensProdutos,
        isActive: form.value.isActive,
      }
      await store.criarProduto(payload)
      snack.value = { show: true, text: 'Banner criado', color: 'success' }
    }

    // Se marcou ativo, idealmente o backend já garante único por categoria.
    await store.carregarProdutos()
    dialog.value = false
  } catch (e) {
    console.error('Salvar banner erro:', e)
    snack.value = { show: true, text: (e?.message || 'Erro ao salvar'), color: 'red' }
  } finally {
    salvando.value = false
  }
}

/* Snackbar */
const snack = ref({ show: false, text: '', color: 'success' })

onMounted(() => {
  store.carregarProdutos()
  if (store.carregarAtivo) store.carregarAtivo()
})
</script>

<style scoped>
.pos-chip {
  position: absolute;
  top: 8px;
  left: 8px;
}
.gap-2 { gap: 8px; }
.d-none { display: none; }
</style>
