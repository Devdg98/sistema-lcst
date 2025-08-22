// store/carrinho.js
import { defineStore } from 'pinia'

export const useCarrinhoStore = defineStore('carrinho', {
  state: () => ({
    itens: [], // { produto, cor, tamanho, quantidade }
    usuario: null // { id, nome, sobrenome, email }
  }),

  actions: {
    setUsuario(dados) {
      this.usuario = dados
    },

    adicionarItem(produto, cor, tamanho) {
      const itemExistente = this.itens.find(item =>
        item.produto._id === produto._id &&
        item.cor === cor &&
        item.tamanho === tamanho
      )

      if (itemExistente) {
        itemExistente.quantidade += 1
      } else {
        this.itens.push({ produto, cor, tamanho, quantidade: 1 })
      }
    },

    removerItem(index) {
      this.itens.splice(index, 1)
    },

    limparCarrinho() {
      this.itens = []
    }
  }
})
