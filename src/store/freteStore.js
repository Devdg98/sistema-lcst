import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

const API_URL = "https://backendgeral-147424face7e.herokuapp.com/frete"; 
// 👉 Se for subir no Heroku, troca para: 
// const API_URL = "https://backendgeral-147424face7e.herokuapp.com/frete";

export const useFreteStore = defineStore("frete", {
  state: () => ({
    minhasEntregas: [],
    fretes: [],
    cotacoes: [],
    cotacaoSelecionada: null,
    freteAtual: null,
    etiqueta: null,
    etiquetas: [],       // 👈 estava faltando no state
    loading: false,
    error: null,
    erro: null
  }),

  actions: {
    handleError(err) {
      this.error =
        err?.response?.data?.erro ||
        err?.response?.data?.message ||
        err?.message ||
        "Erro desconhecido";
      this.erro = this.error;
      console.error("Erro FreteStore:", this.error);
    },

    /** 📦 Criar cotação */
    async criarCotacao(payload) {
      try {
        if (!payload.cepOrigem || !payload.cepDestino || !payload.products?.length) {
          throw new Error("Dados da cotação incompletos");
        }

        const authStore = useAuthStore();

        const produtosConvertidos = payload.products.map((produto) => ({
          name: produto.nome,
          quantity: produto.quantidade,
          unitary_value: produto.valorUnitario || 0,
          weight: produto.peso / 1000,
          height: produto.altura,
          width: produto.largura,
          length: produto.comprimento
        }));

        const response = await axios.post(
          `${API_URL}/cotacoes`,
          {
            cepOrigem: payload.cepOrigem,
            cepDestino: payload.cepDestino,
            produtos: produtosConvertidos
          },
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        this.cotacoes = response.data.cotacoes || [];
        this.cotacaoSelecionada = response.data.cotacaoSelecionada || null;
        return response.data;
      } catch (err) {
        this.handleError(err);
        throw err;
      }
    },

    /** 📋 Listar cotações de um frete */
    async listarCotacoes(freteId) {
      this.loading = true;
      const authStore = useAuthStore();
      try {
        const res = await axios.get(`${API_URL}/cotacoes/${freteId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        this.cotacoes = res.data.cotacoes || [];
        this.cotacaoSelecionada = res.data.cotacaoSelecionada || null;
        return res.data;
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },

    /** 📦 Obter detalhes de um frete */
    async obterFrete(freteId) {
      this.loading = true;
      const authStore = useAuthStore();
      try {
        const res = await axios.get(`${API_URL}/${freteId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        this.freteAtual = res.data;
        this.cotacoes = res.data.cotacoes || [];
        this.cotacaoSelecionada = res.data.cotacaoSelecionada || null;
        return res.data;
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },

    
    // NOVO: lista os fretes do usuário autenticado
    async listarMinhasEntregas() {
      const auth = useAuthStore();
      this.loading = true;
      this.erro = null;
      try {
        const { data } = await axios.get(`${API_URL}/meus/listar`, {
          headers: { Authorization: `Bearer ${auth.token}` },
          params: { limit: 100 }
        });
        this.minhasEntregas = Array.isArray(data) ? data : [];
        return this.minhasEntregas;
      } catch (err) {
        this.handleError(err);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // NOVO: rastreamento detalhado de um frete (order/info/{id})
    async obterRastreamento(freteId) {
      const auth = useAuthStore();
      try {
        const { data } = await axios.get(`${API_URL}/${freteId}/rastreamento`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        return data; // { status, rastreio, previsao, historico[], trackingUrl, ... }
      } catch (err) {
        this.handleError(err);
        return null;
      }
    },
    
    /** ✅ Selecionar cotação */
    async selecionarCotacao(freteId, cotacaoId) {
      this.loading = true;
      const authStore = useAuthStore();
      try {
        const res = await axios.put(
          `${API_URL}/cotacoes/${freteId}`,
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

    /** 🏷️ Gerar etiqueta */
    async gerarEtiqueta(freteId, payload) {
      try {
        if (!payload?.to?.postal_code) {
          throw new Error("CEP do destinatário não informado");
        }
        if (!payload?.from?.postal_code) {
          throw new Error("CEP de origem não informado");
        }

        const authStore = useAuthStore();
        const response = await axios.post(
          `${API_URL}/etiqueta/${freteId}`,
          payload,
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        this.etiquetas.push(response.data);
        return response.data;
      } catch (err) {
        this.handleError(err);
        throw err;
      }
    },

    /** 🖨️ Imprimir etiqueta */
    async imprimirEtiqueta(freteId) {
      try {
        const authStore = useAuthStore();
        const response = await axios.get(`${API_URL}/imprimir/${freteId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        return response.data.urlImpressao;
      } catch (err) {
        this.handleError(err);
        return null;
      }
    },

    /** 📜 Listar todos os fretes */
    async listarTodosFretes() {
      this.loading = true;
      const authStore = useAuthStore();
      try {
        const res = await axios.get(`${API_URL}/listar`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        this.fretes = res.data || [];
        return res.data;
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },

    /** ❌ Cancelar frete */
    async cancelarFrete(freteId, motivo = "cancelamento") {
      this.loading = true;
      const authStore = useAuthStore();
      try {
        const res = await axios.post(
          `${API_URL}/cancelar/${freteId}`,
          { motivo },
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );
        this.fretes = this.fretes.filter((f) => f._id !== freteId);
        return res.data;
      } catch (err) {
        this.handleError(err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    /** ❌ Cancelar uma cotação */
    async cancelarCotacao(freteId, cotacaoId, motivo = "cancelamento") {
      this.loading = true;
      const authStore = useAuthStore();
      try {
        const res = await axios.post(
          `${API_URL}/cancelar-cotacao/${freteId}/${cotacaoId}`,
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
    }
  }
});
