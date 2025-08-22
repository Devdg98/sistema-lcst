// src/stores/pedidoStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePedidoStore = defineStore('pedido', {
  state: () => ({
    pedidos: [],           // pedidos do usuário
    carregando: false,
    erro: null
  }),
  actions: {
    // Carregar todos os pedidos do usuário logado
    async carregarPedidos(usuarioId) {
      try {
        this.carregando = true;
        this.erro = null;
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://backendgeral-147424face7e.herokuapp.com/pedidos/usuario/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.pedidos = res.data;
      } catch (err) {
        console.error(err);
        this.erro = "Erro ao carregar pedidos";
      } finally {
        this.carregando = false;
      }
    },

    // Criar um novo pedido
    async criarPedido(dadosPedido) {
      try {
        this.erro = null;
        const token = localStorage.getItem('token');
        const res = await axios.post('https://backendgeral-147424face7e.herokuapp.com/pedidos', dadosPedido, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.pedidos.push(res.data.pedido);
        return res.data.pedido;
      } catch (err) {
        console.error(err);
        this.erro = "Erro ao criar pedido";
        throw err;
      }
    },

    // Atualizar status do pedido (pago, cancelado, pendente)
    async atualizarStatusPedido(pedidoId, status, pagamentoId = null) {
      try {
        this.erro = null;
        const token = localStorage.getItem('token');
        const res = await axios.put(
          `https://backendgeral-147424face7e.herokuapp.com/pedidos/${pedidoId}/status`,
          { status, pagamentoId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Atualiza pedido local
        const idx = this.pedidos.findIndex(p => p._id === pedidoId);
        if (idx !== -1) this.pedidos[idx] = res.data.pedido;
        return res.data.pedido;
      } catch (err) {
        console.error(err);
        this.erro = "Erro ao atualizar status do pedido";
        throw err;
      }
    },

    // Limpar pedidos da store (logout ou reset)
    limparPedidos() {
      this.pedidos = [];
      this.erro = null;
      this.carregando = false;
    }
  }
});
