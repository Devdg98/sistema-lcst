import { defineStore } from 'pinia';
import axios from 'axios';

const API = 'https://backendgeral-147424face7e.herokuapp.com/banner';

export const useBannerStore = defineStore('bannerCategorias', {
  state: () => ({
    produtos: [],
    loading: false,
    error: null,
    produto: null,
    ativo: null, // 🔥 novo
  }),

  actions: {
    getEstadoInicial() {
      return {
        tituloProduto: '',
        subtituloProduto: '',
        imagensProdutos: [],
        isActive: false,
      };
    },

    async carregarProdutos() {
      this.loading = true;
      try {
        const { data } = await axios.get(API);
        this.produtos = data;
        this.error = null;
      } catch (err) {
        this.error = `Erro ao carregar produtos: ${err.message}`;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async carregarAtivo() {
      try {
        const { data } = await axios.get(`${API}/ativo`);
        this.ativo = data || null;
      } catch (e) {
        this.ativo = null;
      }
    },

    setDadosParaEdicao(produto) {
      this.produto = {
        _id: produto?._id || '',
        tituloProduto: produto?.tituloProduto || '',
        subtituloProduto: produto?.subtituloProduto || '',
        imagensProdutos: [...(produto?.imagensProdutos || [])],
        isActive: !!produto?.isActive,
      };
    },

    async uploadImagem(file) {
      const formData = new FormData();
      formData.append('imagensProdutos', file);
      try {
        const { data } = await axios.post(`${API}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (!data.urls || data.urls.length === 0) throw new Error('Backend não retornou URLs da imagem');
        return data.urls[0];
      } catch (err) {
        console.error('Erro ao fazer upload da imagem', err);
        return null;
      }
    },

    async criarProduto(payload) {
      this.loading = true;
      try {
        const { data } = await axios.post(API, payload);
        this.produtos.unshift(data);
        if (data.isActive) this.ativo = data;
      } catch (err) {
        console.error('Erro ao criar produto:', err?.response?.data || err.message);
        throw err?.response?.data || err;
      } finally {
        this.loading = false;
      }
    },

    async atualizarProduto(id, payload) {
      this.loading = true;
      try {
        const { data } = await axios.put(`${API}/${id}`, payload);
        const i = this.produtos.findIndex(p => p._id === id);
        if (i !== -1) this.produtos[i] = data;
        if (data.isActive) this.ativo = data; // se passou a ativo
      } catch (err) {
        console.error('Erro ao atualizar produto:', err?.response?.data || err.message);
        throw err?.response?.data || err;
      } finally {
        this.loading = false;
      }
    },

    async excluirProduto(id) {
      this.loading = true;
      try {
        await axios.delete(`${API}/${id}`);
        this.produtos = this.produtos.filter(p => p._id !== id);
        if (this.ativo?._id === id) this.ativo = null;
      } catch (err) {
        console.error('Erro ao excluir produto:', err.message);
      } finally {
        this.loading = false;
      }
    },

    async ativar(id) {
      this.loading = true;
      try {
        const { data } = await axios.put(`${API}/${id}/ativar`);
        // desativa todos na memória e ativa só o retornado
        this.produtos = this.produtos.map(p => ({ ...p, isActive: p._id === id }));
        this.ativo = data.banner;
      } catch (e) {
        throw e?.response?.data || e;
      } finally {
        this.loading = false;
      }
    },

    async desativar(id) {
      this.loading = true;
      try {
        const { data } = await axios.put(`${API}/${id}/desativar`); 
        const i = this.produtos.findIndex(p => p._id === id);
        if (i !== -1) this.produtos[i] = data.banner || this.produtos[i];
        if (this.ativo?._id === id) this.ativo = null;
      } catch (e) {
        throw e?.response?.data || e;
      } finally {
        this.loading = false;
      }
    }
  }
});
