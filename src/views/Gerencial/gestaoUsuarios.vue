<!-- src/views/Monitoramento/MonitorLogs.vue -->
<template>
  <v-container fluid class="pa-4 bg-grey-lighten-5">
    <!-- Cabeçalho / Ações -->
    <v-card flat class="mb-3">
      <v-card-title class="d-flex align-center flex-wrap ga-2">
        <div class="d-flex align-center ga-2">
          <v-icon>mdi-shield-search</v-icon>
          <span class="text-h6 font-weight-bold">Monitoramento de E-commerce</span>
          <v-chip size="small" class="ml-1" variant="outlined">Total: {{ logs.length }}</v-chip>
          <v-chip
            v-if="selectedIds.length"
            size="small"
            color="primary"
            class="ml-1"
            variant="tonal"
          >
            Selecionados: {{ selectedIds.length }}
          </v-chip>
        </div>

        <v-spacer />

        <div class="d-flex flex-wrap ga-2">
          <v-btn color="primary" :loading="loading" @click="carregarLogs" prepend-icon="mdi-refresh" variant="elevated">
            Atualizar
          </v-btn>
          <v-btn color="deep-purple" @click="exportarPdf" prepend-icon="mdi-file-pdf-box" variant="elevated">
            Exportar PDF
          </v-btn>

          <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" color="red" variant="elevated" prepend-icon="mdi-delete-sweep">
                Limpeza
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item :disabled="!selectedIds.length" @click="confirmarExcluirSelecionados">
                <template #prepend><v-icon>mdi-delete</v-icon></template>
                <v-list-item-title>Excluir selecionados ({{ selectedIds.length }})</v-list-item-title>
              </v-list-item>

              <v-list-item :disabled="!logsFiltrados.length" @click="confirmarExcluirFiltrados">
                <template #prepend><v-icon>mdi-filter-remove</v-icon></template>
                <v-list-item-title>Excluir filtrados ({{ logsFiltrados.length }})</v-list-item-title>
              </v-list-item>

              <v-divider class="my-1" />

              <v-list-item color="red" @click="confirmarZerarTodos">
                <template #prepend><v-icon color="red">mdi-trash-can-outline</v-icon></template>
                <v-list-item-title class="text-red">Zerar todos os logs</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-card-title>

      <v-card-text>
        <!-- Filtros -->
        <v-row dense class="ga-2">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="buscaTexto"
              density="comfortable"
              hide-details
              clearable
              label="Buscar (IP, usuário, ação…)"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>

          <v-col cols="12" sm="4" md="3">
            <v-text-field
              v-model="filtroUsuario"
              label="Filtrar por usuário"
              density="comfortable"
              hide-details
              clearable
              prepend-inner-icon="mdi-account"
            />
          </v-col>

          <v-col cols="12" sm="4" md="3">
            <v-select
              v-model="filtroAcao"
              :items="acoesDisponiveis"
              label="Filtrar por ação"
              density="comfortable"
              hide-details
              clearable
              prepend-inner-icon="mdi-filter"
            />
          </v-col>

          <v-col cols="12" sm="4" md="2">
            <v-menu v-model="menuData" :close-on-content-click="false" transition="scale-transition">
              <template #activator="{ props }">
                <v-text-field
                  v-model="filtroData"
                  label="Data (YYYY-MM-DD)"
                  v-bind="props"
                  readonly
                  density="comfortable"
                  hide-details
                  clearable
                  prepend-inner-icon="mdi-calendar"
                />
              </template>
              <v-date-picker v-model="filtroData" @update:model-value="menuData=false" hide-header show-adjacent-months />
            </v-menu>
          </v-col>
        </v-row>

        <!-- Chips por ação -->
        <div class="d-flex flex-wrap ga-2 mt-3">
          <v-chip
            v-for="acao in acoesDisponiveis"
            :key="acao"
            :color="acaoColor(acao)"
            variant="tonal"
            size="small"
            @click="toggleAcaoFiltro(acao)"
            :class="{ 'text-white': filtroAcao === acao }"
          >
            <v-icon start size="16">mdi-tag</v-icon>
            {{ acao }} — {{ contagemPorAcao[acao] || 0 }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- Tabela -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="logsFiltrados"
        :loading="loading"
        :items-per-page="10"
        :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        class="elevation-1"
        density="compact"
        show-select
        item-value="_id"
        v-model:selected="selectedIds"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@10" class="mx-4 my-2" />
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.createdAt="{ item }">
          <span class="text-caption">{{ formatDate(item.createdAt || item.criadoEm) }}</span>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.usuario="{ item }">
          <div class="text-body-2">{{ item.usuario || '—' }}</div>
          <div v-if="item.userId" class="text-caption text-grey">{{ item.userId }}</div>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.acao="{ item }">
          <v-chip :color="acaoColor(item.acao)" size="x-small" label class="text-white">
            {{ item.acao || '—' }}
          </v-chip>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.ip="{ item }">
          <div class="d-flex align-center ga-2">
            <span class="text-body-2">{{ item.ip || '—' }}</span>
            <v-tooltip text="Possível VPN/Proxy/Tor" v-if="isSuspeito(item)">
              <template #activator="{ props }">
                <v-chip v-bind="props" color="red" size="x-small" class="text-white">VPN?</v-chip>
              </template>
            </v-tooltip>
          </div>
          <div v-if="item.localizacao?.org" class="text-caption text-grey mt-1">
            {{ item.localizacao.org }} <span v-if="item.localizacao.asn">({{ item.localizacao.asn }})</span>
          </div>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.localizacao="{ item }">
          <div class="text-caption">
            {{ item.localizacao?.cidade || '—' }}, {{ item.localizacao?.estado || '—' }} — {{ item.localizacao?.pais || '—' }}
          </div>
          <div v-if="item.localizacao?.latitude && item.localizacao?.longitude" class="mt-1 d-flex ga-1">
            <v-btn size="x-small" variant="outlined" prepend-icon="mdi-map" @click="abrirMapa(item)">
              Mapa
            </v-btn>
            <v-btn size="x-small" variant="text" color="red" icon @click="confirmarExcluirUm(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="pa-6 text-medium-emphasis">Nenhum log encontrado.</div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog Mapa -->
    <v-dialog v-model="dialogMapa.visible" max-width="900">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-map</v-icon>
          Localização aproximada
          <v-spacer />
          <v-btn icon variant="text" @click="dialogMapa.visible=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <iframe
            v-if="mapsEmbedUrl"
            :src="mapsEmbedUrl"
            width="100%"
            height="480"
            style="border:0"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
          <div v-else class="pa-6">Sem coordenadas para exibir.</div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Dialog confirmação -->
    <v-dialog v-model="dialogConfirma.visible" max-width="520">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-alert</v-icon>
          {{ dialogConfirma.titulo }}
          <v-spacer />
          <v-btn icon variant="text" @click="dialogConfirma.visible=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="text-body-2">
          {{ dialogConfirma.mensagem }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogConfirma.visible=false">Cancelar</v-btn>
          <v-btn :color="dialogConfirma.cor || 'red'" @click="dialogConfirma.onConfirm" :loading="busy">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Detalhes -->
    <v-dialog v-model="dialogDetalhes" max-width="720">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-information-outline</v-icon>
          Detalhes
          <v-spacer />
          <v-btn icon variant="text" @click="copiarDetalhes" title="Copiar JSON"><v-icon>mdi-content-copy</v-icon></v-btn>
          <v-btn icon variant="text" @click="dialogDetalhes=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <pre class="code-block">{{ detalheFormatado }}</pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="elevated" color="primary" @click="dialogDetalhes=false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2500" top right>
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API = 'https://backendgeral-147424face7e.herokuapp.com'

const loading = ref(false)
const busy = ref(false)
const logs = ref([])
const selectedIds = ref([])

const buscaTexto = ref('')
const filtroUsuario = ref('')
const filtroAcao = ref(null)
const filtroData = ref(null)
const menuData = ref(false)

const dialogMapa = ref({ visible: false, lat: null, lon: null })
const dialogDetalhes = ref(false)
const detalheSelecionado = ref(null)
const snackbar = ref({ show: false, text: '', color: 'success' })
const dialogConfirma = ref({
  visible: false,
  titulo: '',
  mensagem: '',
  cor: 'red',
  onConfirm: () => {}
})

const headers = [
  { title: 'Data', key: 'createdAt', width: 170 },
  { title: 'Usuário', key: 'usuario', minWidth: 160 },
  { title: 'Ação', key: 'acao', width: 150 },
  { title: 'IP / ISP', key: 'ip', minWidth: 220 },
  { title: 'Localização', key: 'localizacao', minWidth: 220 },
]

async function carregarLogs () {
  loading.value = true
  try {
    const params = {}
    if (filtroUsuario.value) params.usuario = filtroUsuario.value
    if (filtroAcao.value) params.acao = filtroAcao.value
    if (filtroData.value) { params.desde = filtroData.value; params.ate = filtroData.value }
    const { data } = await axios.get(`${API}/monitor`, { params })
    logs.value = Array.isArray(data) ? data : []
    // limpamos seleção se os itens mudaram
    selectedIds.value = []
  } catch (e) {
    console.error('Erro ao listar logs:', e)
    toast('Erro ao listar logs', 'red')
    logs.value = []
  } finally {
    loading.value = false
  }
}

const acoesDisponiveis = computed(() => {
  const set = new Set()
  for (const l of logs.value) if (l?.acao) set.add(l.acao)
  return Array.from(set).sort()
})

const contagemPorAcao = computed(() => {
  const map = {}
  for (const l of logs.value) {
    const a = l?.acao || '—'
    map[a] = (map[a] || 0) + 1
  }
  return map
})

const logsFiltrados = computed(() => {
  const q = (buscaTexto.value || '').toLowerCase().trim()
  return logs.value.filter(l => {
    const dStr = l?.createdAt || l?.criadoEm ? new Date(l.createdAt || l.criadoEm).toISOString().slice(0,10) : ''
    const matchBusca =
      !q ||
      String(l?.ip || '').toLowerCase().includes(q) ||
      String(l?.usuario || '').toLowerCase().includes(q) ||
      String(l?.acao || '').toLowerCase().includes(q) ||
      String(l?.localizacao?.cidade || '').toLowerCase().includes(q) ||
      String(l?.localizacao?.pais || '').toLowerCase().includes(q)
    const matchUser = !filtroUsuario.value || String(l?.usuario || '').toLowerCase().includes(filtroUsuario.value.toLowerCase())
    const matchAcao = !filtroAcao.value || l?.acao === filtroAcao.value
    const matchData = !filtroData.value || dStr === filtroData.value
    return matchBusca && matchUser && matchAcao && matchData
  })
})

function isSuspeito(item) {
  return Boolean(item?.localizacao?.isVpn || item?.localizacao?.isProxy || item?.localizacao?.isTor)
}

function abrirMapa(item) {
  const lat = item?.localizacao?.latitude
  const lon = item?.localizacao?.longitude
  if (!lat || !lon) { toast('Sem coordenadas para exibir.', 'orange'); return }
  dialogMapa.value = { visible: true, lat, lon }
}

const mapsEmbedUrl = computed(() => {
  const { lat, lon } = dialogMapa.value || {}
  if (!lat || !lon) return ''
  return 'https://www.google.com/maps?q=' + lat + ',' + lon + '&z=12&output=embed'
})



const detalheFormatado = computed(() => {
  try { return JSON.stringify(detalheSelecionado.value ?? {}, null, 2) } catch { return '' }
})

function copiarDetalhes () {
  try {
    navigator.clipboard.writeText(detalheFormatado.value)
    toast('Detalhes copiados.', 'green')
  } catch {
    toast('Falha ao copiar.', 'orange')
  }
}

function toggleAcaoFiltro(acao) {
  filtroAcao.value = (filtroAcao.value === acao) ? null : acao
}

function acaoColor(acao) {
  const map = {
    LOGIN: 'indigo',
    LOGOUT: 'grey',
    PEDIDO_CRIADO: 'teal',
    PEDIDO_ATUALIZADO: 'blue',
    ERRO: 'red',
    FRETE_ETIQUETA: 'deep-purple',
  }
  return map[acao] || 'primary'
}

function formatDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleString('pt-BR') } catch { return String(d) }
}

function toast(text, color = 'success') { snackbar.value = { show: true, text, color } }

/** ====== Limpeza / Exclusões ====== */
function confirmarExcluirSelecionados() {
  const qt = selectedIds.value.length
  if (!qt) return
  dialogConfirma.value = {
    visible: true,
    titulo: 'Excluir selecionados',
    mensagem: `Tem certeza que deseja excluir ${qt} registro(s) selecionado(s)? Esta ação não pode ser desfeita.`,
    cor: 'red',
    onConfirm: excluirSelecionados
  }
}

async function excluirSelecionados() {
  try {
    busy.value = true
    const ids = selectedIds.value
    await axios.post(`${API}/monitor/bulk-delete`, { ids })
    toast(`Excluídos ${ids.length} registro(s).`, 'green')
    dialogConfirma.value.visible = false
    await carregarLogs()
  } catch (e) {
    console.error(e)
    toast('Erro ao excluir selecionados.', 'red')
  } finally {
    busy.value = false
  }
}

function confirmarExcluirFiltrados() {
  const qt = logsFiltrados.value.length
  if (!qt) return
  dialogConfirma.value = {
    visible: true,
    titulo: 'Excluir filtrados',
    mensagem: `Tem certeza que deseja excluir os ${qt} registro(s) atualmente filtrados?`,
    cor: 'orange',
    onConfirm: excluirFiltrados
  }
}

async function excluirFiltrados() {
  try {
    busy.value = true
    const ids = logsFiltrados.value.map(l => l._id).filter(Boolean)
    await axios.post(`${API}/monitor/bulk-delete`, { ids })
    toast(`Excluídos ${ids.length} registro(s) filtrados.`, 'green')
    dialogConfirma.value.visible = false
    await carregarLogs()
  } catch (e) {
    console.error(e)
    toast('Erro ao excluir filtrados.', 'red')
  } finally {
    busy.value = false
  }
}

function confirmarZerarTodos() {
  dialogConfirma.value = {
    visible: true,
    titulo: 'Zerar todos os logs',
    mensagem: 'Isto vai apagar TODOS os registros do monitoramento. Tem certeza?',
    cor: 'red',
    onConfirm: zerarTodos
  }
}

async function zerarTodos() {
  try {
    busy.value = true
    await axios.delete(`${API}/monitor`)
    toast('Todos os logs foram apagados.', 'green')
    dialogConfirma.value.visible = false
    await carregarLogs()
  } catch (e) {
    console.error(e)
    toast('Erro ao zerar logs.', 'red')
  } finally {
    busy.value = false
  }
}

function confirmarExcluirUm(item) {
  if (!item?._id) return
  dialogConfirma.value = {
    visible: true,
    titulo: 'Excluir registro',
    mensagem: `Excluir log ${item._id}?`,
    cor: 'red',
    onConfirm: () => excluirUm(item._id)
  }
}

async function excluirUm(id) {
  try {
    busy.value = true
    await axios.delete(`${API}/monitor/${id}`)
    toast('Registro excluído.', 'green')
    dialogConfirma.value.visible = false
    await carregarLogs()
  } catch (e) {
    console.error(e)
    toast('Erro ao excluir registro.', 'red')
  } finally {
    busy.value = false
  }
}

/** Exportar para PDF (via janela com HTML e window.print) */
function exportarPdf () {
  const rows = logsFiltrados.value
  if (!rows.length) { toast('Sem dados para exportar.', 'orange'); return }

  const esc = (v)=> String(v ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')

  let trs = ''
  for (const r of rows) {
    trs += '<tr>'
      + '<td>' + esc(formatDate(r.createdAt || r.criadoEm)) + '</td>'
      + '<td>' + esc(r.usuario) + '</td>'
      + '<td>' + esc(r.acao) + '</td>'
      + '<td>' + esc(r.ip) + '</td>'
      + '<td>' + esc([r.localizacao?.cidade, r.localizacao?.estado, r.localizacao?.pais].filter(Boolean).join(', ')) + '</td>'
      + '<td>' + esc([r.localizacao?.org, r.localizacao?.asn].filter(Boolean).join(' ')) + '</td>'
      + '<td>' + esc(['VPN:' + !!r.localizacao?.isVpn, 'Proxy:' + !!r.localizacao?.isProxy, 'Tor:' + !!r.localizacao?.isTor].join(' | ')) + '</td>'
      + '</tr>'
  }

  const html =
    '<!doctype html>'
    + '<html><head><meta charset="utf-8"/>'
    + '<title>Monitor Logs</title>'
    + '<style>'
    + 'body{font-family:Arial,sans-serif;}'
    + 'h1{font-size:18px;margin:0 0 10px;}'
    + '.sub{color:#666;font-size:12px;margin-bottom:12px;}'
    + 'table{border-collapse:collapse;width:100%;font-size:12px;}'
    + 'th,td{border:1px solid #ccc;padding:6px 8px;vertical-align:top;}'
    + 'th{background:#f5f5f5;}'
    + '.footer{margin-top:10px;font-size:11px;color:#777;}'
    + '@page{size:A4 landscape;margin:12mm;}'
    + '</style></head><body>'
    + '<h1>Monitoramento de E-commerce — Logs</h1>'
    + '<div class="sub">Gerado em ' + esc(new Date().toLocaleString('pt-BR')) + '</div>'
    + '<table><thead><tr>'
    + '<th>Data</th><th>Usuário</th><th>Ação</th><th>IP</th>'
    + '<th>Localização</th><th>ISP/ASN</th><th>Flags</th>'
    + '</tr></thead><tbody>'
    + trs
    + '</tbody></table>'
    + '<div class="footer">Total de registros: ' + rows.length + '</div>'
    + '<script>window.print();</' + 'script>'
    + '</body></html>'

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}

onMounted(() => { carregarLogs() })
</script>

<style scoped>
.code-block {
  background: #0e1111;
  color: #eaeef2;
  padding: 12px;
  border-radius: 6px;
  overflow: auto;
  font-size: 12px;
}
</style>
