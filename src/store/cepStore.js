// src/stores/cepStore.js
import { defineStore } from 'pinia';
import axios from 'axios'; // Certifique-se de ter o axios instalado: npm install axios

export const useCepStore = defineStore('cep', {
  state: () => ({
    address: null, // Armazenará os dados do endereço retornado pela API
    loading: false, // Indica se a requisição está em andamento
    error: null,    // Armazenará mensagens de erro, se houver
  }),
  actions: {
    async fetchAddressByCep(cep) {
      this.loading = true;
      this.error = null;
      this.address = null; // Limpa o endereço anterior ao iniciar uma nova busca

      // Remove caracteres não numéricos do CEP para garantir o formato correto
      const cleanedCep = cep.replace(/\D/g, '');

      if (cleanedCep.length !== 8) {
        this.error = 'CEP inválido. Digite 8 dígitos numéricos.';
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        
        if (response.data.erro) {
          this.error = 'CEP não encontrado.';
          this.address = null;
        } else {
          this.address = response.data;
        }
      } catch (err) {
        this.error = 'Erro ao buscar o CEP. Tente novamente mais tarde.';
        console.error('Erro na API ViaCEP:', err);
      } finally {
        this.loading = false;
      }
    },
    // Opcional: Limpar o estado do CEP
    clearAddress() {
      this.address = null;
      this.error = null;
    }
  }
});