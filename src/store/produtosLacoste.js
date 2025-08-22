import { defineStore } from 'pinia';
import axios from 'axios';

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
        categoriaProduto: '',
        descricaoProduto: '',
        tamanhoProduto: '',
        tamanhosSelecionados: [],
        corProduto: '',
        coresSelecionadas: [],
        generoProduto: '',
        valorProduto: null,
        valorDesconto: null,
        estoqueProduto: null,
        imagensProdutos: []
      };
    },

    async carregarProdutos() {
      this.loading = true;
      try {
        const { data } = await axios.get('https://backendgeral-147424face7e.herokuapp.com/produtos');
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
        descricaoProduto: produto?.descricaoProduto || '',
        tamanhoProduto: produto?.tamanhoProduto || '',
        tamanhosSelecionados: produto?.tamanhosSelecionados || [],
        corProduto: produto?.corProduto || '',
        coresSelecionadas: produto?.coresSelecionadas || [],
        generoProduto: produto?.generoProduto || '',
        valorProduto: produto?.valorProduto || null,
        valorDesconto: produto?.valorDesconto || null,
        estoqueProduto: produto?.estoqueProduto || null,
        imagensProdutos: [...(produto?.imagensProdutos || [])]
      };
    },

    async uploadImagem(file) {
      const formData = new FormData();
      formData.append('imagem', file);
      const { data } = await axios.post('https://backendgeral-147424face7e.herokuapp.com/produtos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.url;
    },

    async criarProduto(produtoPayload) {
      this.loading = true;
      try {
        const { data } = await axios.post('https://backendgeral-147424face7e.herokuapp.com/produtos', produtoPayload);
        this.produtos.push(data);
        this.error = null;
      } catch (err) {
        this.error = `Erro ao criar produto: ${err.message}`;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async atualizarProduto(id, produtoPayload) {
  this.loading = true;
  try {
    let response;

    if (produtoPayload instanceof FormData) {
      // Envia com multipart/form-data
      response = await axios.put(
        `https://backendgeral-147424face7e.herokuapp.com/produtos/${id}`,
        produtoPayload,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    } else {
      // Envia JSON normal
      response = await axios.put(
        `https://backendgeral-147424face7e.herokuapp.com/produtos/${id}`,
        produtoPayload
      );
    }

    const index = this.produtos.findIndex((p) => p._id === id);
    if (index !== -1) {
      this.produtos[index] = response.data;
    }
    this.error = null;
  } catch (err) {
    this.error = `Erro ao atualizar produto: ${err.message}`;
    console.error(err);
  } finally {
    this.loading = false;
  }
},



    async excluirProduto(id) {
      this.loading = true;
      try {
        await axios.delete(`https://backendgeral-147424face7e.herokuapp.com/produtos/${id}`);
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
