// src/stores/checkout.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useCarrinhoStore } from './carrinho'
import { useAuthStore } from './auth'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    loading: false,
    erro: null,
    initPoint: null,
    pedidoId: null
  }),

  actions: {
    async iniciarCheckout() {
      this.loading = true;
      this.erro = null;

      const carrinhoStore = useCarrinhoStore();
      const authStore = useAuthStore();

      if (!authStore.estaLogado) {
        this.erro = 'Você precisa estar logado para finalizar a compra.';
        this.loading = false;
        return;
      }

      try {
        const itens = carrinhoStore.itens.map(item => ({
          produto: item.produto,
          quantidade: item.quantidade,
          valorUnitario: item.produto.valorProduto,
          cor: item.cor,
          tamanho: item.tamanho
        }));

        const { data } = await axios.post(
          'https://backendgeral-147424face7e.herokuapp.com/pagamento/criar-preferencia',
          { itens },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        );

        this.initPoint = data.init_point || null;
        this.pedidoId = data.pedidoId || null;

        if (!this.initPoint) {
          this.erro = 'Erro ao iniciar pagamento.';
        } else {
          // opcional: limpar carrinho aqui ou após confirmação do webhook
          // carrinhoStore.limparCarrinho();
        }
      } catch (err) {
        console.error('Erro ao iniciar checkout:', err.response?.data || err.message);
        this.erro = err.response?.data?.mensagem || 'Erro ao iniciar checkout. Tente novamente.';
      } finally {
        this.loading = false;
      }
    }
  }
});
