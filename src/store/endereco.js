import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useEnderecoStore = defineStore("endereco", {
  state: () => ({
    enderecos: [],
    carregando: false,
    erro: null
  }),

  actions: {
    async carregarEnderecos() {
      try {
        const authStore = useAuthStore();
        if (!authStore.estaLogado) throw new Error("Usuário não autenticado.");

        this.carregando = true;
        const res = await axios.get(
          `https://backendgeral-147424face7e.herokuapp.com/enderecos/${authStore.usuario.id}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        );
        this.enderecos = res.data;
        this.erro = null;
      } catch (error) {
        console.error(error);
        this.erro = "Erro ao carregar endereços";
      } finally {
        this.carregando = false;
      }
    },

    async adicionarEndereco(endereco) {
      try {
        const authStore = useAuthStore();
        if (!authStore.estaLogado) throw new Error("Usuário não autenticado.");

        const res = await axios.post(
          "https://backendgeral-147424face7e.herokuapp.com/enderecos",
          endereco,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        );

        this.enderecos.push(res.data.endereco);
        this.erro = null;
        return res.data.endereco;
      } catch (error) {
        console.error(error);
        this.erro = "Erro ao adicionar endereço";
        throw error;
      }
    },

    async removerEndereco(id) {
      try {
        const authStore = useAuthStore();
        if (!authStore.estaLogado) throw new Error("Usuário não autenticado.");

        await axios.delete(`https://backendgeral-147424face7e.herokuapp.com/enderecos/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        this.enderecos = this.enderecos.filter(e => e._id !== id);
        this.erro = null;
      } catch (error) {
        console.error(error);
        this.erro = "Erro ao remover endereço";
      }
    },
    async atualizarEndereco(id, dados) {
  try {
    const authStore = useAuthStore();
    const res = await axios.put(
      `https://backendgeral-147424face7e.herokuapp.com/enderecos/${id}`,
      dados,
      {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }
    );
    const index = this.enderecos.findIndex(e => e._id === id);
    if (index !== -1) this.enderecos[index] = res.data.endereco;
    return res.data.endereco;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar endereço');
  }
}

  }
});

