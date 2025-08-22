<template>
  <v-container fluid>
    <h2 class="text-h4 mb-4">
      <v-icon class="mr-2">mdi-chart-line</v-icon>
      Logs de Acesso e Interação
    </h2>
    <v-card>
      <v-card-title class="pa-4 font-weight-bold">
        <v-row no-gutters>
          <v-col cols="2">Status</v-col>
          <v-col cols="3">IP do Convidado</v-col>
          <v-col cols="4">Data e Hora</v-col>
          <v-col cols="3">Descrição</v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>

      <div v-if="loading" class="text-center pa-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-2">Carregando logs...</div>
      </div>

      <div v-else>
        <v-list v-if="logs.length > 0" dense>
          <v-list-item v-for="(log, index) in logs" :key="index">
            <v-row no-gutters align="center">
              <v-col cols="2">
                <v-chip :color="log.status === 'Online' ? 'green' : 'red'" dark small>
                  {{ log.status }}
                </v-chip>
              </v-col>
              <v-col cols="3">{{ log.ip }}</v-col>
              <v-col cols="4">{{ log.timestamp }}</v-col>
              <v-col cols="3">{{ log.description }}</v-col>
            </v-row>
          </v-list-item>
        </v-list>

        <v-alert v-else type="info" class="ma-4">
          Nenhum log de convidado encontrado.
        </v-alert>
      </div>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);



const logs = ref([]);

// Função mock para simular a obtenção de dados de uma API
const fetchLogs = async () => {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500));

  const fetchedData = [
    { status: 'Online', ip: '192.168.1.5', timestamp: '22/08/2025 11:45', description: 'Navegou na página de Produtos' },
    { status: 'Offline', ip: '200.220.30.1', timestamp: '22/08/2025 11:42', description: 'Acessou a página inicial' },
    { status: 'Online', ip: '192.168.1.5', timestamp: '22/08/2025 11:40', description: 'Clicou no botão "Detalhes do Produto"' },
    { status: 'Online', ip: '172.16.0.10', timestamp: '22/08/2025 11:38', description: 'Adicionou um item ao carrinho' },
    { status: 'Offline', ip: '200.220.30.1', timestamp: '22/08/2025 11:35', description: 'Fechou o navegador' },
    { status: 'Online', ip: '192.168.1.5', timestamp: '22/08/2025 11:30', description: 'Visita iniciada' },
  ];

  logs.value = fetchedData;
  loading.value = false;
};

onMounted(() => {
  fetchLogs();
});
</script>

<style scoped>
.elevation-1 {
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}
</style>