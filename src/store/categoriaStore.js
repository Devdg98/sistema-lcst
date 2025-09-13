import { defineStore } from 'pinia';
import axios from 'axios';

export const useCategoriaStore = defineStore('bannerCategorias', {
  state: () => ({
    produtos: [],
    loading: false,
    error: null,
    produto: null, // usado para edição
  }),

  actions: {
    getEstadoInicial() {
      return {
        marcaProduto: '',
        categoriaProduto: '',
        imagensProdutos: [],
 
      };
    },

    async carregarProdutos() {
      this.loading = true;
      try {
        const { data } = await axios.get('https://backendgeral-147424face7e.herokuapp.com/categorias');
        this.produtos = data;
        this.error = null;
      } catch (err) {
        this.error = `Erro ao carregar produtos: ${err.message}`;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    setDadosParaEdicao(produto) {
      this.produto = {
        _id: produto?._id || '',
        marcaProduto: produto?.marcaProduto || '',
        categoriaProduto: produto?.categoriaProduto || '',
        imagensProdutos: [...(produto?.imagensProdutos || [])],

      };
    },

  async uploadImagem(file) {
  const formData = new FormData();
  formData.append('imagensProdutos', file);

  try {
    const { data } = await axios.post(
      'https://backendgeral-147424face7e.herokuapp.com/categorias/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    if (!data.urls || data.urls.length === 0) {
      throw new Error("Backend não retornou URLs da imagem");
    }

    return data.urls[0]; // retorna só a primeira URL
  } catch (err) {
    console.error("Erro ao fazer upload da imagem", err);
    return null;
  }
},



    async criarProduto(produtoPayload) {
  this.loading = true;
  try {
    const { data } = await axios.post(
      'https://backendgeral-147424face7e.herokuapp.com/categorias',
      produtoPayload
    );
    this.produtos.push(data);
  } catch (err) {
    console.error('Erro ao criar produto:', err.message);
  } finally {
    this.loading = false;
  }
},

async atualizarProduto(id, produtoPayload) {
  this.loading = true;
  try {
    const { data } = await axios.put(
      `https://backendgeral-147424face7e.herokuapp.com/categorias/${id}`,
      produtoPayload
    );
    const index = this.produtos.findIndex(p => p._id === id);
    if (index !== -1) this.produtos[index] = data;
  } catch (err) {
    console.error('Erro ao atualizar produto:', err.message);
  } finally {
    this.loading = false;
  }
},

    async excluirProduto(id) {
      this.loading = true;
      try {
        await axios.delete(`https://backendgeral-147424face7e.herokuapp.com/categorias/${id}`);
        this.produtos = this.produtos.filter(p => p._id !== id);
        this.error = null;
      } catch (err) {
        this.error = `Erro ao excluir produto: ${err.message}`;
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
});
