// src/store/produtosLacoste.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

// Ajuste a URL base dos PRODUTOS
const API_URL = 'https://backendgeral-147424face7e.herokuapp.com';
const PROD_URL = `${API_URL.replace(/\/$/, '')}/produtos`;

function toFormData(payload = {}) {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      // arrays comuns: serialize como JSON
      fd.append(k, JSON.stringify(v));
    } else if (typeof v === 'object' && !(v instanceof File)) {
      // objetos (ex.: promocao/promocaoEspecial)
      fd.append(k, JSON.stringify(v));
    } else {
      fd.append(k, v);
    }
  });
  return fd;
}

export const useProdutosLacoste = defineStore('produtosLacoste', {
  state: () => ({
    produtos: [],
    loading: false,
    error: null
  }),

  actions: {
    getEstadoInicial() {
      return {
        marcaProduto: '',
        descricaoProduto: '',
        categoriaProduto: '',
        generoProduto: '',
        valorProduto: 0,
        valorDesconto: 0,
        imagensProdutos: [],
        variacoes: [],
        statusVenda: 'Normal',
        ativo: true,
        promocao: { ativo: false, tipo: 'percentual', valor: 0, inicio: '', fim: '' },
        promocaoEspecial: { ativo: false, nome: '', prioridade: 1, descontoExtra: 0, inicio: '', fim: '' }
      };
    },

    async carregarProdutos() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get(PROD_URL);
        this.produtos = Array.isArray(data) ? data : [];
      } catch (err) {
        this.error = err?.response?.data?.error || err.message;
      } finally {
        this.loading = false;
      }
    },

    async criarProduto(body) {
      try {
        const auth = useAuthStore();
        const fd = toFormData(body);
        // imagens por upload? front envia via updateProduto() ou pela UI de upload
        const { data } = await axios.post(PROD_URL, fd, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        this.produtos.unshift(data);
        return data;
      } catch (err) {
        this.error = err?.response?.data?.error || err.message;
        throw err;
      }
    },

    async atualizarProduto(id, body) {
      try {
        const auth = useAuthStore();
        const fd = toFormData(body);
        const { data } = await axios.put(`${PROD_URL}/${id}`, fd, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        const idx = this.produtos.findIndex(p => p._id === id);
        if (idx !== -1) this.produtos[idx] = data;
        return data;
      } catch (err) {
        this.error = err?.response?.data?.error || err.message;
        throw err;
      }
    },

    async atualizarProdutoStatus(id, status) {
      try {
        const auth = useAuthStore();
        const { data } = await axios.put(`${PROD_URL}/${id}/status`, { statusVenda: status }, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const idx = this.produtos.findIndex(p => p._id === id);
        if (idx !== -1) this.produtos[idx] = data;
        return data;
      } catch (err) {
        this.error = err?.response?.data?.error || err.message;
        throw err;
      }
    },

    async atualizarStatusEmMassa(ids, status) {
      try {
        const auth = useAuthStore();
        const { data } = await axios.put(`${PROD_URL}/status/bulk`, { ids, statusVenda: status }, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        await this.carregarProdutos();
        return data;
      } catch (err) {
        this.error = err?.response?.data?.error || err.message;
        throw err;
      }
    },

    async aplicarPromocaoEspecialEmMassa(payload) {
      try {
        const auth = useAuthStore();
        const { ids, promocaoEspecial } = payload;
        const { data } = await axios.put(`${PROD_URL}/promocao-especial/bulk`, { ids, promocaoEspecial }, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        await this.carregarProdutos();
        return data;
      } catch (err) {
        this.error = err?.response?.data?.error || err.message;
        throw err;
      }
    },

    async excluirProduto(id) {
      try {
        const auth = useAuthStore();
        await axios.delete(`${PROD_URL}/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } });
        this.produtos = this.produtos.filter(p => p._id !== id);
      } catch (err) {
        this.error = err?.response?.data?.error || err.message;
        throw err;
      }
    },

    async uploadImagem(file) {
      try {
        const auth = useAuthStore();
        const fd = new FormData();
        fd.append('imagensProdutos', file);
        const { data } = await axios.post(`${PROD_URL}/upload`, fd, {
          headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'multipart/form-data' }
        });
        return data?.urls?.[0] || null;
      } catch (err) {
        this.error = err?.response?.data?.error || err.message;
        throw err;
      }
    }
  }
});
