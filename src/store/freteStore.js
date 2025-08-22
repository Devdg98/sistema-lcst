import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useFreteStore = defineStore("frete", {
  state: () => ({
    fretes: [],
    cotacoes: [],
    cotacaoSelecionada: null,
    freteId: null,
    etiqueta: null,
    loading: false,
    error: null,
  }),

  actions: {
    // --- FUNÇÃO AUXILIAR PARA TRATAR ERROS ---
    handleError(err) {
      this.error = err.response?.data?.erro || err.response?.data?.message || err.message;
      console.error('Erro FreteStore:', this.error);
    },

    // --- CRIAR COTAÇÃO ---
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
          'http://localhost:2998/frete/cotacao',
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

    // --- SELECIONAR COTAÇÃO ---
    async selecionarCotacao(freteId, cotacaoId) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const res = await axios.put(
          `http://localhost:2998/frete/cotacao/${freteId}`,
          { cotacaoId },
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        this.cotacaoSelecionada = res.data.cotacaoSelecionada;
        return res.data;
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },

    // --- GERAR ETIQUETA ---
// --- GERAR ETIQUETA ---
// freteStore.js
async gerarEtiqueta(freteId, cotacaoId, enderecos) {
  this.carregando = true
  this.erro = null
  const authStore = useAuthStore()

  // Validação mínima
  if (!enderecos?.from || !enderecos?.to) {
    this.erro = "Endereços obrigatórios incompletos"
    this.carregando = false
    throw new Error(this.erro)
  }

  try {
    const res = await axios.post(
      `http://localhost:2998/frete/etiqueta/${String(freteId)}`,
      {
        cotacaoId: cotacaoId ? String(cotacaoId) : null,
        from: enderecos.from,
        to: enderecos.to
      },
      {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }
    )

    this.etiqueta = res.data
    return res.data
  } catch (err) {
    this.handleError(err)
    throw err
  } finally {
    this.carregando = false
  }
},



    // --- LISTAR TODOS FRETES ---
    async listarTodosFretes() {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const res = await axios.get(
          "http://localhost:2998/frete/listar",
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        this.fretes = res.data;
        return res.data;
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },

    // --- LISTAR COTAÇÕES ---
    async listarCotacoes(freteId) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const res = await axios.get(
          `http://localhost:2998/frete/cotacoes/${freteId}`,
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        this.cotacoes = res.data.cotacoes || [];
        this.cotacaoSelecionada = res.data.cotacaoSelecionada || null;
        return res.data;
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },

    // --- OBTER FRETE ESPECÍFICO ---
    async obterFrete(freteId) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const res = await axios.get(
          `http://localhost:2998/frete/${freteId}`,
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        this.cotacoes = res.data.cotacoes || [];
        this.cotacaoSelecionada = res.data.cotacaoSelecionada || null;
        return res.data;
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },

    // --- CANCELAR FRETE ---
    async cancelarFrete(freteId, motivo = 'cancelamento') {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const res = await axios.post(
          `http://localhost:2998/frete/cancelar/${freteId}`,
          { motivo },
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        // Atualiza lista local removendo frete cancelado
        this.fretes = this.fretes.filter(f => f._id !== freteId);
        return res.data;
      } catch (err) {
        this.handleError(err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // --- CANCELAR COTAÇÃO ---
    async cancelarCotacao(freteId, cotacaoId, motivo = 'cancelamento') {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const res = await axios.post(
          `http://localhost:2998/frete/cancelar-cotacao/${freteId}/${cotacaoId}`,
          { motivo },
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        this.cotacoes = res.data.cotacoes || [];
        if (this.cotacaoSelecionada?._id === cotacaoId) {
          this.cotacaoSelecionada = null;
        }
        return res.data;
      } catch (err) {
        this.handleError(err);
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
