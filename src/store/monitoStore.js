// src/stores/monitorStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useMonitorStore = defineStore('monitor', {
  state: () => ({
    ip: null,
    localizacao: null,
    navegador: null,
    dispositivo: null,
    logs: []
  }),
  actions: {
    async coletarDados() {
      try {
        // Detecta IP público usando fallback se api.ipify.org falhar
        try {
          const { data } = await axios.get('https://api.ipify.org?format=json');
          this.ip = data.ip;
        } catch {
          this.ip = null;
        }

        // Detecta navegador e dispositivo
        this.navegador = navigator.userAgent;
        this.dispositivo = {
          plataforma: navigator.platform,
          tipo: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
        };

        // Geolocalização aproximada pelo IP (fallback seguro)
        if (this.ip) {
          try {
            const geoRes = await axios.get(`https://ipapi.co/${this.ip}/json/`);
            this.localizacao = {
              pais: geoRes.data.country_name,
              cidade: geoRes.data.city,
              estado: geoRes.data.region
            };
          } catch {
            this.localizacao = null;
          }
        }
      } catch (err) {
        console.error('Erro ao coletar dados do usuário:', err);
      }
    },

    async registrarAcao(acao, dadosExtras = {}) {
      try {
        await axios.post(
          'https://backendgeral-147424face7e.herokuapp.com/monitor/registrar', // ajuste seu backend
          {
            ip: this.ip,
            navegador: this.navegador,
            dispositivo: this.dispositivo,
            localizacao: this.localizacao,
            acao,
            extras: dadosExtras
          }
        );
      } catch (err) {
        console.error('Erro ao registrar ação do usuário:', err);
      }
    },

    async listarLogs() {
      try {
        const { data } = await axios.get('https://backendgeral-147424face7e.herokuapp.com/monitor');
        this.logs = data;
      } catch (err) {
        console.error('Erro ao listar logs:', err);
        this.logs = [];
      }
    }
  }
});
