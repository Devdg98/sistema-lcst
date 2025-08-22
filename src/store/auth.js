import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: { nome: '', sobrenome: '', email: '', telefone: '' },
    token: null,
    error: null
  }),

  getters: {
    estaLogado: (state) => !!state.token && !!state.usuario?.id
  },

  actions: {
    async registrar(usuario) {
      try {
        const res = await fetch('https://backendgeral-147424face7e.herokuapp.com/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario)
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.mensagem || err.message || 'Erro no cadastro');
        }
        const data = await res.json();
        this.usuario = data.usuario || {};
        this.token = data.token || null;
        this.error = null;
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      } catch (e) {
        this.error = e.message;
      }
    },

    async login(email, senha) {
      try {
        const res = await fetch('https://backendgeral-147424face7e.herokuapp.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase(), senha })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.mensagem || err.message || 'Erro no login');
        }
        const data = await res.json();
        this.usuario = data.usuario || {};
        this.token = data.token || null;
        this.error = null;
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      } catch (e) {
        this.error = e.message;
      }
    },

    logout() {
      this.usuario = { nome: '', sobrenome: '', email: '', telefone: '' };
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    },

    carregarTokenLocal() {
      const token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');
      if (token) this.token = token;
      if (usuario) {
        try {
          this.usuario = JSON.parse(usuario);
        } catch {
          this.usuario = { nome: '', sobrenome: '', email: '', telefone: '' };
        }
      }
    }
  }
});
