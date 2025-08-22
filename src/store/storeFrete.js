// store/freteStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useFreteStore = defineStore('frete', {
  state: () => ({
    cotacao: null,          // Última cotação criada
    fretes: [],             // Lista de fretes salvos
    carregando: false,
    erro: null
  }),

  actions: {
    async criarCotacao(payload) {
      this.carregando = true;
      this.erro = null;
      this.cotacao = null;

      try {
        const token = localStorage.getItem('token');

        // Validação rápida no store
        if (!payload.cepOrigem || !payload.cepDestino || !payload.produtos?.length) {
          throw new Error("Preencha todos os campos obrigatórios e adicione pelo menos 1 produto.");
        }

        const { data } = await axios.post(
          'https://backendgeral-147424face7e.herokuapp.com/frete/cotacao',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.cotacao = data;
        return data;

      } catch (err) {
        this.erro = err.response?.data?.error || err.message;
        console.error('Erro ao criar cotação:', this.erro);
        throw err;
      } finally {
        this.carregando = false;
      }
    },

    async listarFretes() {
      this.carregando = true;
      this.erro = null;

      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('https://backendgeral-147424face7e.herokuapp.com/frete/listar', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fretes = data;

      } catch (err) {
        this.erro = err.response?.data?.error || err.message;
        console.error('Erro ao listar fretes:', this.erro);

      } finally {
        this.carregando = false;
      }
    }
  }
});
