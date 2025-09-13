<!-- src/views/Gerencial/fretesGerencial.vue -->
<template>
  <v-container fluid class="pa-3 bg-grey-lighten-5">
    <div class="d-flex align-center mb-3">
      <v-icon class="mr-2">mdi-truck</v-icon>
      <h2 class="text-h5 font-weight-bold mr-2">Gerencial de Fretes</h2>

      <v-spacer />

      <v-text-field
        v-model="q"
        placeholder="Buscar por ID do frete, pedido, usuário, transportadora..."
        prepend-inner-icon="mdi-magnify"
        density="comfortable"
        hide-details
        class="mr-2"
        style="max-width: 420px"
        clearable
      />

      <v-btn color="primary" :loading="loading" @click="fetchFretes" :ripple="false">
        <v-icon start>mdi-refresh</v-icon> Atualizar
      </v-btn>
    </div>

    <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-3">
      {{ errorMsg }}
    </v-alert>

    <v-card class="elevation-1">
      <v-data-table
        :headers="headers"
        :items="filtered"
        :loading="loading"
        item-key="_id"
        density="comfortable"
      >
        <template v-slot:[`item._id`]="{ item }">
          <v-tooltip :text="item._id">
            <template #activator="{ props }">
              <span v-bind="props">#{{ item._id.slice(-6) }}</span>
            </template>
          </v-tooltip>
        </template>

        <template v-slot:[`item.usuario`] ="{ item }">
          <div class="text-body-2">
            <strong>{{ item.usuario?.nome || '—' }}</strong>
            <div class="text-caption">{{ item.usuario?.email }}</div>
          </div>
        </template>

        <template v-slot:[`item.valor`]="{ item }">
          {{ formatCurrency(item?.cotacaoSelecionada?.valor ?? 0) }}
        </template>

        <template v-slot:[`item.prazo`]="{ item }">
          <span v-if="item?.cotacaoSelecionada?.prazo">{{ item.cotacaoSelecionada.prazo }} dia(s)</span>
          <span v-else>—</span>
        </template>

        <template v-slot:[`item.service`]="{ item }">
          <div class="text-caption">
            <strong>{{ item?.cotacaoSelecionada?.carrier || item?.frete?.carrier || '—' }}</strong><br>
            <span class="text-grey">{{ item?.cotacaoSelecionada?.service || item?.service || '—' }}</span>
          </div>
        </template>

        <template v-slot:[`item.createdAt`]="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="x-small"
            variant="elevated"
            color="primary"
            class="mr-1"
            :loading="busyId === 'print:'+item._id"
            @click="imprimir(item)"
            :ripple="false"
          >
            <v-icon start size="16">mdi-printer</v-icon> Imprimir
          </v-btn>

          <v-btn
            size="x-small"
            variant="outlined"
            color="error"
            class="mr-1"
            :disabled="!item.etiquetaId"
            :loading="busyId === 'cancel:'+item._id"
            @click="cancelar(item)"
            :ripple="false"
          >
            <v-icon start size="16">mdi-cancel</v-icon> Cancelar
          </v-btn>

          <v-btn
            size="x-small"
            variant="text"
            @click="item._show = !item._show"
            :ripple="false"
          >
            <v-icon start size="16">mdi-chevron-down</v-icon>
            Cotações
          </v-btn>
        </template>

        <!-- Linha expandida: lista cotações -->
        <template #expanded-row="{ columns, item }">
          <td :colspan="columns.length" class="pa-3">
            <div class="text-subtitle-2 mb-2">Cotações vinculadas</div>
            <v-alert v-if="!Array.isArray(item.cotacoes) || !item.cotacoes.length" type="info" variant="tonal">
              Nenhuma cotação registrada.
            </v-alert>

            <v-table v-else density="compact" class="border">
              <thead>
                <tr>
                  <th style="width: 220px;">ID / Serviço</th>
                  <th style="width: 180px;">Transportadora</th>
                  <th style="width: 120px;">Valor</th>
                  <th style="width: 100px;">Prazo</th>
                  <th style="width: 160px;" class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in item.cotacoes" :key="String(c.cotacaoId)">
                  <td>
                    <div class="text-caption">
                      <strong>{{ c.cotacaoId || c.id || '—' }}</strong><br />
                      <span class="text-grey">{{ c.service || '—' }}</span>
                    </div>
                  </td>
                  <td>{{ c.carrier || '—' }}</td>
                  <td>{{ formatCurrency(c.valor ?? c.price ?? 0) }}</td>
                  <td>
                    <span v-if="Number.isFinite(Number(c.prazo)) && Number(c.prazo) > 0">
                      {{ Number(c.prazo) }} dia(s)
                    </span>
                    <span v-else>—</span>
                  </td>
                  <td class="text-right">
                    <v-btn
                      size="x-small"
                      variant="text"
                      color="error"
                      :loading="busyId === `cancelCot:${item._id}:${c.cotacaoId}`"
                      @click="cancelarCotacao(item, c.cotacaoId)"
                      :ripple="false"
                    >
                      <v-icon start size="16">mdi-close</v-icon> Remover
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </td>
        </template>

      </v-data-table>
    </v-card>

    <v-snackbar v-model="snackbar.visible" :timeout="3500" :color="snackbar.color" top right>
      <v-icon start>{{ snackbar.color === 'red' ? 'mdi-alert' : 'mdi-check-circle' }}</v-icon>
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API = 'https://backendgeral-147424face7e.herokuapp.com'
const token = localStorage.getItem('token')

const loading = ref(false)
const errorMsg = ref('')
const items = ref([])
const q = ref('')
const busyId = ref(null)

const snackbar = ref({ visible: false, message: '', color: 'success' })

const headers = [
  { title: 'Frete', key: '_id', sortable: false },
  { title: 'Usuário', key: 'usuario', sortable: false },
  { title: 'Serviço', key: 'service', sortable: false },
  { title: 'Valor', key: 'valor', sortable: false },
  { title: 'Prazo', key: 'prazo', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Criado em', key: 'createdAt', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false },
]

const filtered = computed(() => {
  const text = (q.value || '').toLowerCase().trim()
  if (!text) return items.value
  return items.value.filter(f =>
    f._id?.toLowerCase().includes(text) ||
    f.pedidoId?.toLowerCase?.().includes(text) ||
    f.usuario?.nome?.toLowerCase?.().includes(text) ||
    f.usuario?.email?.toLowerCase?.().includes(text) ||
    f?.cotacaoSelecionada?.carrier?.toLowerCase?.().includes(text) ||
    f?.cotacaoSelecionada?.service?.toLowerCase?.().includes(text)
  )
})

function formatCurrency(v) {
  return (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(d) {
  try { return new Date(d).toLocaleString('pt-BR') } catch { return '' }
}

async function fetchFretes() {
  try {
    loading.value = true
    errorMsg.value = ''
    const { data } = await axios.get(`${API}/frete/listar`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    // garante flag de expand
    items.value = (Array.isArray(data) ? data : []).map(x => ({ ...x, _show: false }))
  } catch (e) {
    console.error('[fretes] listar erro:', e)
    errorMsg.value = e?.response?.data?.erro || e?.message || 'Erro ao listar fretes'
  } finally {
    loading.value = false
  }
}

async function imprimir(item) {
  try {
    busyId.value = 'print:' + item._id
    const { data } = await axios.get(`${API}/frete/imprimir/${item._id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })

    const url = data?.urlImpressao
    const pdfBase64 = data?.pdfBase64

    if (url) {
      window.open(url, '_blank')
      snackbar.value = { visible: true, message: 'Link de impressão aberto em nova aba.', color: 'success' }
      return
    }

    if (pdfBase64) {
      // abre o base64 em um Blob PDF
      const byteChars = atob(pdfBase64)
      const byteNumbers = new Array(byteChars.length)
      for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i)
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl, '_blank')
      snackbar.value = { visible: true, message: 'PDF aberto em nova aba.', color: 'success' }
      return
    }

    // Sem URL nem PDF
    snackbar.value = { visible: true, message: 'A API não retornou link nem PDF para impressão.', color: 'red' }
  } catch (e) {
    console.error('[fretes] imprimir erro:', e?.response?.data || e)
    const msg = e?.response?.data?.error || e?.response?.data?.erro || 'Erro ao gerar link de impressão'
    snackbar.value = { visible: true, message: msg, color: 'red' }
  } finally {
    busyId.value = null
  }
}


async function cancelar(item) {
  const ok = confirm(`Cancelar o frete ${item._id}? Essa ação não pode ser desfeita.`)
  if (!ok) return
  try {
    busyId.value = 'cancel:' + item._id
    const { data } = await axios.post(`${API}/frete/cancelar/${item._id}`, {}, {
      headers: { Authorization: 'Bearer ' + token }
    })
    snackbar.value = { visible: true, message: data?.mensagem || 'Frete cancelado.', color: 'success' }
    await fetchFretes()
  } catch (e) {
    console.error('[fretes] cancelar erro:', e?.response?.data || e)
    const msg = e?.response?.data?.erro || 'Erro ao cancelar frete'
    snackbar.value = { visible: true, message: msg, color: 'red' }
  } finally {
    busyId.value = null
  }
}

async function cancelarCotacao(item, cotacaoId) {
  const ok = confirm(`Remover cotação ${cotacaoId} do frete ${item._id}?`)
  if (!ok) return
  try {
    busyId.value = `cancelCot:${item._id}:${cotacaoId}`
    const { data } = await axios.post(
      `${API}/frete/cancelar-cotacao/${item._id}/${cotacaoId}`,
      {},
      { headers: { Authorization: 'Bearer ' + token } }
    )
    snackbar.value = { visible: true, message: data?.mensagem || 'Cotação removida.', color: 'success' }
    // atualiza apenas o item alterado para evitar full reload:
    const idx = items.value.findIndex(f => f._id === item._id)
    if (idx >= 0) {
      items.value[idx] = { ...items.value[idx], cotacoes: data?.cotacoes || [] }
    }
  } catch (e) {
    console.error('[fretes] cancelar cotação erro:', e?.response?.data || e)
    const msg = e?.response?.data?.erro || 'Erro ao cancelar cotação'
    snackbar.value = { visible: true, message: msg, color: 'red' }
  } finally {
    busyId.value = null
  }
}

onMounted(fetchFretes)
</script>

<style scoped>
.border { border: 1px solid #E0E0E0; border-radius: 6px; }
</style>
