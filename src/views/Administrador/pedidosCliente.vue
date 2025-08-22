<template>
  <v-container>
    <div class="text-h4 font-weight-bold mb-6">Meus Pedidos</div>

    <v-card class="pa-4" flat>
      <v-card-text>
        <v-expansion-panels flat>
          <v-expansion-panel
            v-for="pedido in pedidos"
            :key="pedido.id"
            class="mb-4"
          >
            <v-expansion-panel-header>
              <div class="d-flex align-center">
                <v-icon left>mdi-file-document-outline</v-icon>
                <span>Pedido #{{ pedido.id }} - {{ formatarPreco(pedido.total) }}</span>
                <v-spacer></v-spacer>
                <v-chip :color="statusColor(pedido.status)" class="font-weight-bold">{{ pedido.status }}</v-chip>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider class="my-2"></v-divider>
              <div class="font-weight-medium mb-2">Itens do Pedido:</div>
              <v-list dense>
                <v-list-item v-for="(item, index) in pedido.itens" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.produto }}</v-list-item-title>
                    <v-list-item-subtitle>
                      Quantidade: {{ item.quantidade }} - {{ formatarPreco(item.preco) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-alert
          v-if="pedidos.length === 0"
          type="info"
          class="mt-4"
          border="start"
          variant="outlined"
        >
          Você ainda não fez nenhum pedido.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      pedidos: [
        {
          id: '1001',
          data: '14/08/2025',
          status: 'Enviado',
          total: 250.00,
          itens: [
            { produto: 'Tênis Branco', quantidade: 1, preco: 250.00 }
          ],
        },
        {
          id: '1002',
          data: '13/08/2025',
          status: 'Entregue',
          total: 499.90,
          itens: [
            { produto: 'Camiseta Polo Verde', quantidade: 2, preco: 150.00 },
            { produto: 'Boné Clássico', quantidade: 1, preco: 199.90 },
          ],
        },
      ],
    };
  },
  methods: {
    statusColor(status) {
      if (status === 'Entregue') return 'green';
      if (status === 'Enviado') return 'blue';
      return 'orange';
    },
    formatarPreco(valor) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valor);
    },
  },
};
</script>