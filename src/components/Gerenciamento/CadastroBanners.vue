<template>
  <div>
    <!-- Botão principal -->
    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      @click="abrirDialog"
    >
      Novo Banner
    </v-btn>

    <!-- Diálogo de cadastro -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="text-h6">Cadastrar Banner</span>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="formValido">
            <v-text-field
              v-model="novoBanner.tituloProduto"
              label="Título do Banner"
              placeholder="Ex: Novidades"
              :rules="[v => !!v || 'Campo obrigatório']"
              required
            />

            <v-text-field
              v-model="novoBanner.subtituloProduto"
              label="Subtítulo"
              placeholder="Ex: Confira nossa nova coleção"
              :rules="[v => !!v || 'Campo obrigatório']"
              required
            />

            <!-- Upload de imagens -->
            <v-file-input
              v-model="arquivos"
              multiple
              accept="image/*"
              label="Imagens do Banner"
              prepend-icon="mdi-image"
              show-size
              chips
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            @click="salvarBanner"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBannerStore } from '@/store/bannerStore'

const bannerStore = useBannerStore()

const dialog = ref(false)
const form = ref(null)
const formValido = ref(false)
const loading = ref(false)

const novoBanner = ref({
  tituloProduto: '',
  subtituloProduto: '',
  imagensProdutos: []
})
const arquivos = ref([])

// abre o diálogo
function abrirDialog() {
  novoBanner.value = {
    tituloProduto: '',
    subtituloProduto: '',
    imagensProdutos: []
  }
  arquivos.value = []
  dialog.value = true
}

// salvar no backend
async function salvarBanner() {
  const ok = await form.value.validate()
  if (!ok.valid) return

  loading.value = true
  try {
    // Faz upload das imagens uma por uma
    const urls = []
    for (const file of arquivos.value) {
      const url = await bannerStore.uploadImagem(file)
      if (url) urls.push(url)
    }

    // Monta payload
    const payload = {
      tituloProduto: novoBanner.value.tituloProduto,
      subtituloProduto: novoBanner.value.subtituloProduto,
      imagensProdutos: urls
    }

    await bannerStore.criarProduto(payload)
    dialog.value = false
  } catch (err) {
    console.error('Erro ao salvar banner:', err)
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <v-container class="pa-4">
    <div class="d-flex align-center mb-4">
      <h2 class="text-h5 font-weight-bold mb-0">Gerenciar Banners</h2>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirDialogNovo">
        Novo Banner
      </v-btn>
      <v-btn class="ml-2" variant="text" :loading="store.loading" @click="recarregar">
        <v-icon start>mdi-refresh</v-icon> Atualizar
      </v-btn>
    </div>

    <v-alert v-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <v-data-table
      :headers="headers"
      :items="store.produtos"
      :loading="store.loading"
      item-key="_id"
      density="comfortable"
    >
      <template v-slot:[`item.isActive`]="{ item }">
        <v-chip :color="item.isActive ? 'green' : 'grey' " variant="flat" size="small">
          {{ item.isActive ? 'Ativo' : 'Inativo' }}
        </v-chip>
      </template>

      <template v-slot:[`item.imagensProdutos`]="{ item }">
        <v-avatar v-if="(item.imagensProdutos||[]).length" size="40">
          <v-img :src="item.imagensProdutos[0]" />
        </v-avatar>
        <span v-else class="text-grey">—</span>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn size="x-small" variant="text" color="teal" @click="editar(item)">
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

    <!-- Dialog de Criar/Editar -->
    <v-dialog v-model="dialog" max-width="620">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="text-h6">{{ editando? 'Editar Banner' : 'Novo Banner' }}</span>
          <v-btn icon @click="dialog=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="formValido">
            <v-text-field
              v-model="formData.tituloProduto"
              label="Título"
              :rules="[v => !!v || 'Obrigatório']"
              required
            />
            <v-text-field
              v-model="formData.subtituloProduto"
              label="Subtítulo"
              :rules="[v => !!v || 'Obrigatório']"
              required
            />
            <v-switch
              v-model="formData.isActive"
              color="green"
              inset
              label="Marcar como ativo (apenas 1 ativo no site)"
            />

            <v-file-input
              v-model="arquivos"
              multiple
              accept="image/*"
              label="Imagens (opcional)"
              prepend-icon="mdi-image"
              show-size chips
              class="mt-2"
            />

            <div class="mt-3">
              <div class="text-caption mb-1">Imagens atuais</div>
              <div class="d-flex flex-wrap gap-2">
                <v-avatar
                  v-for="(url, i) in formData.imagensProdutos"
                  :key="i"
                  size="64"
                  class="mr-2 mb-2"
                >
                  <v-img :src="url" />
                </v-avatar>
                <span v-if="!formData.imagensProdutos?.length" class="text-grey">Nenhuma</span>
              </div>
            </div>

          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="dialog=false">Cancelar</v-btn>
          <v-btn color="primary" :loading="store.loading" @click="salvar">
            {{ editando? 'Atualizar' : 'Salvar' }}
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
import { ref, onMounted } from 'vue';
import { useBannerStore } from '@/store/bannerStore';

const store = useBannerStore();

const headers = [
  { title: 'Ativo', key: 'isActive', sortable: false, width: 90 },
  { title: 'Título', key: 'tituloProduto' },
  { title: 'Subtítulo', key: 'subtituloProduto' },
  { title: 'Imagem', key: 'imagensProdutos', sortable: false, width: 100 },
  { title: 'Ações', key: 'actions', sortable: false, width: 320 },
];

const dialog = ref(false);
const editando = ref(false);
const form = ref(null);
const formValido = ref(false);
const arquivos = ref([]);

const formData = ref(store.getEstadoInicial());

const snack = ref({ show: false, text: '', color: 'success' });

function abrirDialogNovo() {
  editando.value = false;
  arquivos.value = [];
  formData.value = store.getEstadoInicial();
  dialog.value = true;
}

function editar(item) {
  editando.value = true;
  arquivos.value = [];
  formData.value = {
    _id: item._id,
    tituloProduto: item.tituloProduto,
    subtituloProduto: item.subtituloProduto,
    imagensProdutos: [...(item.imagensProdutos || [])],
    isActive: !!item.isActive,
  };
  dialog.value = true;
}

async function salvar() {
  const ok = await form.value.validate();
  if (!ok.valid) return;

  try {
    // faz upload das novas imagens (se houver)
    for (const file of arquivos.value) {
      const url = await store.uploadImagem(file);
      if (url) formData.value.imagensProdutos.push(url);
    }

    if (editando.value) {
      await store.atualizarProduto(formData.value._id, {
        tituloProduto: formData.value.tituloProduto,
        subtituloProduto: formData.value.subtituloProduto,
        imagensProdutosExistentes: formData.value.imagensProdutos,
        isActive: formData.value.isActive,
      });
      snack.value = { show: true, text: 'Banner atualizado', color: 'success' };
    } else {
      await store.criarProduto({
        tituloProduto: formData.value.tituloProduto,
        subtituloProduto: formData.value.subtituloProduto,
        imagensProdutos: formData.value.imagensProdutos,
        isActive: formData.value.isActive,
      });
      snack.value = { show: true, text: 'Banner criado', color: 'success' };
    }

    dialog.value = false;
  } catch (e) {
    snack.value = { show: true, text: (e?.error || 'Erro ao salvar'), color: 'red' };
  }
}

async function excluir(item) {
  if (!confirm(`Excluir o banner "${item.tituloProduto}"?`)) return;
  await store.excluirProduto(item._id);
  snack.value = { show: true, text: 'Banner excluído', color: 'success' };
}

async function ativar(item) {
  try {
    await store.ativar(item._id);
    snack.value = { show: true, text: 'Banner ativado', color: 'success' };
  } catch (e) {
    snack.value = { show: true, text: (e?.error || 'Erro ao ativar'), color: 'red' };
  }
}

async function desativar(item) {
  try {
    await store.desativar(item._id);
    snack.value = { show: true, text: 'Banner desativado', color: 'success' };
  } catch (e) {
    snack.value = { show: true, text: (e?.error || 'Erro ao desativar'), color: 'red' };
  }
}

function recarregar() {
  store.carregarProdutos();
}

onMounted(() => {
  store.carregarProdutos();
});
</script>

<style scoped>
.gap-2 { gap: 8px; }
</style>
