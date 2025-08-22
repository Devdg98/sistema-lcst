// src/stores/pagamento.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';
import { useCarrinhoStore } from './carrinho';

export const usePagamentoStore = defineStore('pagamento', {
  actions: {
    async criarPreferencia() {
      const authStore = useAuthStore();
      const carrinhoStore = useCarrinhoStore();

      if (!authStore.estaLogado) throw new Error('Faça login antes de finalizar a compra');
      if (carrinhoStore.itens.length === 0) throw new Error('Carrinho vazio');

      const itensParaEnvio = carrinhoStore.itens.map(({ produto, quantidade, cor, tamanho }) => ({
        produto,
        quantidade,
        valorUnitario: produto.valorProduto || 0,
        cor,
        tamanho
      }));

      const response = await axios.post('https://backendgeral-147424face7e.herokuapp.com/pagamento/criar-preferencia',
        { itens: itensParaEnvio },
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      );

      return response.data.init_point;
    }
  }
});
