<template>
  <v-container>
    <div class="text-h4 font-weight-bold mb-6">Minhas Entregas</div>

    <v-card class="pa-4" flat>
      <v-card-text>
        <v-expansion-panels flat>
          <v-expansion-panel
            v-for="entrega in entregas"
            :key="entrega.id"
            class="mb-4"
          >
            <v-expansion-panel-header>
              <div class="d-flex align-center">
                <v-icon left>mdi-truck-fast</v-icon>
                <span>Entrega do Pedido #{{ entrega.pedidoId }}</span>
                <v-spacer></v-spacer>
                <v-chip :color="entregaColor(entrega.status)" class="font-weight-bold">{{ entrega.status }}</v-chip>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider class="my-2"></v-divider>
              <div class="mb-2">
                <span class="font-weight-medium">Rastreio:</span> {{ entrega.rastreio }}
              </div>
              <div class="mb-2">
                <span class="font-weight-medium">Previsão de Entrega:</span> {{ entrega.previsao }}
              </div>
              <div class="mt-4 font-weight-medium">Histórico de Rastreamento:</div>
              <v-list dense>
                <v-list-item v-for="(etapa, index) in entrega.historico" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ etapa.status }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ etapa.data }} - {{ etapa.local }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-alert
          v-if="entregas.length === 0"
          type="info"
          class="mt-4"
          border="start"
          variant="outlined"
        >
          Você ainda não tem entregas em andamento.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      entregas: [
        {
          id: 1,
          pedidoId: '1001',
          rastreio: 'BR123456789BR',
          status: 'Em Trânsito',
          previsao: '16/08/2025',
          historico: [
            { data: '15/08/2025 10:00', status: 'Saiu para Entrega', local: 'São Paulo, SP' },
            { data: '15/08/2025 08:00', status: 'Em Rota de Distribuição', local: 'Centro de Distribuição, SP' },
            { data: '14/08/2025 18:30', status: 'Pedido Enviado', local: 'Mauá, SP' },
          ],
        },
        {
          id: 2,
          pedidoId: '1002',
          rastreio: 'BR987654321BR',
          status: 'Entregue',
          previsao: '14/08/2025',
          historico: [
            { data: '14/08/2025 14:00', status: 'Entregue', local: 'Mauá, SP' },
            { data: '14/08/2025 09:00', status: 'Saiu para Entrega', local: 'Mauá, SP' },
          ],
        },
      ],
    };
  },
  methods: {
    entregaColor(status) {
      if (status === 'Entregue') return 'green';
      if (status === 'Em Trânsito') return 'blue';
      return 'orange';
    },
  },
};
</script>