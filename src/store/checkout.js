// stores/checkout.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

const toMoney = (v, def = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : def
}
const toPrazoOrNull = (v) => {
  const n = Number(v)
  return Number.isFinite(n) && Math.trunc(n) >= 1 ? Math.trunc(n) : null
}

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    loading: false,
    erro: null,
    initPoint: null,
    pedidoId: null
  }),

  actions: {
    async iniciarCheckout({ itens, cotacao, endereco, total }) {
      this.loading = true
      this.erro = null

      const authStore = useAuthStore()

      if (!authStore.estaLogado) {
        this.erro = 'Você precisa estar logado para finalizar a compra.'
        this.loading = false
        return
      }

      try {
        // ===== normalizações coerentes com o controller =====
        const freteValor   = toMoney(cotacao?.valor ?? cotacao?.price ?? 0)
        const freteServico = String(cotacao?.service || cotacao?.servico || 'Entrega')
        const freteCarrier = String(cotacao?.carrier || 'Transportadora')
        const fretePrazo   = toPrazoOrNull(cotacao?.prazo) // só envia se >= 1

        // formato esperado pelo controller
        const itensController = (itens || []).map(i => ({
          produto: i?.produto || {}, // snapshot do produto
          quantidade: toMoney(i?.quantidade ?? 1, 1),
          valorUnitario: toMoney(i?.valorUnitario ?? i?.produto?.valorProduto ?? 0),
          cor: i?.cor,
          tamanho: i?.tamanho
        }))

        // payload compatível com o controller
        const fretePayload = {
          valor: freteValor,
          servico: freteServico,
          carrier: freteCarrier,
          ...(fretePrazo !== null ? { prazo: fretePrazo } : {}) // << inclui prazo só se válido
        }

        const payload = {
          itens: itensController,
          frete: fretePayload,
          // o controller atual não usa 'endereco' nem 'valorTotal', mas não atrapalha enviar:
          endereco,
          valorTotal: toMoney(total || 0)
        }

        // diagnóstico (remova em produção se quiser)
        console.log('[checkout] payload.frete =>', payload.frete)

        const { data } = await axios.post(
          'https://backendgeral-147424face7e.herokuapp.com/pagamento/criar-preferencia',
          payload,
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        )

        this.initPoint = data.init_point || data.initPoint || null
        this.pedidoId  = data.pedidoId || null

        if (this.initPoint) {
          window.location.href = this.initPoint
        } else {
          this.erro = 'Erro ao iniciar pagamento.'
        }
      } catch (err) {
        const apiMsg = err?.response?.data?.mensagem || err?.response?.data?.message
        console.error('Erro ao iniciar checkout:', err?.response?.data || err?.message)
        this.erro = apiMsg || 'Erro ao iniciar checkout. Tente novamente.'
      } finally {
        this.loading = false
      }
    }
  }
})
