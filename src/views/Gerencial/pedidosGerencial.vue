<template>
  <v-container>
    <h2>Gestão de Pedidos com Notificações</h2>

    <!-- Snackbar de notificação -->
    <v-snackbar
      v-model="snackbar.visible"
      :timeout="4000"
      :color="snackbar.color"
      top
      right
    >
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Filtros -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-select
          v-model="filtroStatus"
          :items="statusOptions"
          label="Filtrar por status"
          clearable
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-menu
          v-model="menuData"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="auto"
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="filtroDataTexto"
              label="Filtrar por intervalo de datas"
              readonly
              v-bind="attrs"
              v-on="on"
              clearable
            />
          </template>
          <v-date-picker
            v-model="filtroData"
            range
            @input="menuData = false"
          />
        </v-menu>
      </v-col>

      <v-col cols="12" md="5">
        <v-text-field
          v-model="buscaTexto"
          label="Buscar por usuário ou produto"
          clearable
        />
      </v-col>
    </v-row>

    <!-- Tabela de pedidos -->
    <v-data-table
      :headers="headers"
      :items="pedidosFiltrados"
      item-key="_id"
      class="elevation-1"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item._id }}</td>
          <td>{{ item.usuario?.nome || '—' }}</td>
          <td>R$ {{ item.valorTotal.toFixed(2) }}</td>
          <td>
            <v-chip :color="chipColor(item.status)" small>{{ item.status }}</v-chip>
          </td>
          <td>
            <div v-for="i in item.itens" :key="i.produto._id" class="mb-2">
              <strong>{{ i.produto.marcaProduto }} {{ i.produto.descricaoProduto }}</strong>
              <div>Tamanho: {{ i.tamanho }}, Cor: {{ i.cor }}, Qtde: {{ i.quantidade }}</div>
              <div>
                <v-img
                  v-for="img in i.produto.imagensProdutos"
                  :key="img"
                  :src="img"
                  max-width="50"
                  class="mr-1"
                  contain
                />
              </div>
            </div>

            <v-btn
              v-if="item.status === 'pago'"
              color="blue darken-1"
              small
              @click="iniciarSeparacao(item._id)"
            >
              Iniciar Separação
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import axios from 'axios';

const pedidos = ref([]);
const token = localStorage.getItem('token');

// Filtros
const filtroStatus = ref(null);
const filtroData = ref({ start: null, end: null });
const menuData = ref(false);
const filtroDataTexto = ref('');
const buscaTexto = ref('');

const statusOptions = ['pendente', 'pago', 'em separacao', 'cancelado'];

const headers = [
  { text: 'ID do Pedido', value: '_id' },
  { text: 'Usuário', value: 'usuario' },
  { text: 'Valor Total', value: 'valorTotal' },
  { text: 'Status', value: 'status' },
  { text: 'Itens', value: 'itens' },
];

// Snackbar
const snackbar = ref({ visible: false, message: '', color: 'success' });

// Atualizar texto do range de datas
watch(filtroData, (newVal) => {
  if (newVal.start && newVal.end) {
    filtroDataTexto.value = `${newVal.start} → ${newVal.end}`;
  } else {
    filtroDataTexto.value = '';
  }
});

// Filtrar pedidos
const pedidosFiltrados = computed(() => {
  return pedidos.value
    .filter(p => {
      const statusOk = filtroStatus.value ? p.status === filtroStatus.value : true;

      let dataOk = true;
      if (filtroData.value.start && filtroData.value.end) {
        const pedidoData = new Date(p.createdAt).toISOString().slice(0,10);
        dataOk = pedidoData >= filtroData.value.start && pedidoData <= filtroData.value.end;
      }

      const buscaOk = buscaTexto.value
        ? (p.usuario?.nome?.toLowerCase().includes(buscaTexto.value.toLowerCase()) ||
           p.itens.some(i => i.produto.marcaProduto.toLowerCase().includes(buscaTexto.value.toLowerCase()) ||
                            i.produto.descricaoProduto.toLowerCase().includes(buscaTexto.value.toLowerCase())))
        : true;

      return statusOk && dataOk && buscaOk;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // já acessa pedidos.value no computed
});


// Buscar pedidos
const fetchPedidos = async () => {
  try {
    const res = await axios.get('https://backendgeral-147424face7e.herokuapp.com/pedidos', {
      headers: { Authorization: 'Bearer ' + token }
    });
    pedidos.value = res.data;
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
  }
};

// Atualizar status para "em separacao"
const iniciarSeparacao = async (pedidoId) => {
  try {
    await axios.patch(
      `https://backendgeral-147424face7e.herokuapp.com/pedidos/${pedidoId}/status`,
      { status: 'em separacao' },
      { headers: { Authorization: 'Bearer ' + token } }
    );
    snackbar.value = { visible: true, message: 'Pedido iniciado para separação', color: 'info' };
  } catch (error) {
    console.error('Erro ao iniciar separação:', error);
  }
};

// Cores dos chips
const chipColor = (status) => {
  switch (status) {
    case 'pago': return 'green';
    case 'pendente': return 'orange';
    case 'em separacao': return 'blue';
    case 'cancelado': return 'red';
    default: return 'grey';
  }
};

// WebSocket
let ws;

onMounted(() => {
  fetchPedidos();

  ws = new WebSocket('ws://192.168.18.136:2998'); // trocar pelo URL público

  ws.onopen = () => console.log('WebSocket conectado');

  ws.onmessage = (event) => {
    const pedidoAtualizado = JSON.parse(event.data);

    const index = pedidos.value.findIndex(p => p._id === pedidoAtualizado._id);
    if (index !== -1) {
      pedidos.value[index] = pedidoAtualizado;
      // Notificação se mudou para pago
      if (pedidoAtualizado.status === 'pago') {
        snackbar.value = { visible: true, message: `Pedido ${pedidoAtualizado._id} pago!`, color: 'success' };
      }
    } else {
      pedidos.value.unshift(pedidoAtualizado);
      if (pedidoAtualizado.status === 'pago') {
        snackbar.value = { visible: true, message: `Novo pedido pago: ${pedidoAtualizado._id}`, color: 'success' };
      }
    }
  };

  ws.onclose = () => console.log('WebSocket desconectado');
});

onUnmounted(() => {
  if (ws) ws.close();
});
</script>

<style scoped>
.v-data-table tr td {
  vertical-align: top;
}
</style>
