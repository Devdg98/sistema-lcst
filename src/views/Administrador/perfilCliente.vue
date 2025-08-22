<template>
  <v-container class="perfil-container mt-n6">
    <!-- Título -->
    <div class="titulo-principal">MEU PERFIL</div>
    <div class="descricao">
      Registre ou modifique suas informações pessoais, endereços de entrega e meios de pagamento para facilitar seus pedidos futuros.
    </div>

    <!-- CARD INFORMAÇÕES PESSOAIS -->
    <v-card class="card-lacoste mt-4" flat>
      <v-card-title class="card-header d-flex justify-space-between align-center">
        <span class="titulo-card">INFORMAÇÕES PESSOAIS</span>
        <v-btn elevation="0" icon class="btn-icone" @click="abrirBottomSheet('dadosPessoais')">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text v-if="authStore.usuario">
        <div><span class="label">Nome:</span> {{ authStore.usuario?.nome }}</div>
        <div><span class="label">Sobrenome:</span> {{ authStore.usuario?.sobrenome }}</div>
        <div><span class="label">E-mail:</span> {{ authStore.usuario?.email }}</div>

      </v-card-text>
    </v-card>

    <!-- CARD LOGIN & SENHA -->
    <v-card class="card-lacoste mt-4" flat>
      <v-card-title class="card-header d-flex justify-space-between align-center">
        <span class="titulo-card">LOGIN & SENHA</span>
        <v-btn elevation="0" icon class="btn-icone" @click="abrirBottomSheet('loginSenha')">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <div><span class="label">Login:</span> {{ authStore.usuario.email }}</div>
        <div><span class="label">Senha:</span> ********</div>
      </v-card-text>
    </v-card>

    <!-- CARD ENDEREÇOS -->
    <v-card class="card-lacoste mt-4" flat>
      <v-card-title class="card-header d-flex justify-space-between align-center">
        <span class="titulo-card">MEUS ENDEREÇOS</span>
        <v-btn elevation="0" icon class="btn-icone" @click="abrirBottomSheet('enderecoEntrega')">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text v-if="enderecoStore.enderecos.length">
        <div v-for="(end, index) in enderecoStore.enderecos" :key="index" class="mb-2">
          <div><span class="label">Endereço:</span> {{ end.rua }}, {{ end.numero }}</div>
          <div><span class="label">Cidade:</span> {{ end.cidade }} - {{ end.estado }}</div>
        </div>
      </v-card-text>
      <v-card-text v-else>
        <div>Nenhum endereço cadastrado.</div>
      </v-card-text>
    </v-card>

    <!-- BOTTOM SHEET -->
    <v-bottom-sheet v-model="bottomSheetAberto">
      <v-toolbar class="toolbar-lacoste" flat>
        <v-toolbar-title class="text-subtitle">
          <v-icon class="mr-2">mdi-account</v-icon>{{ tituloSheet }}
        </v-toolbar-title>
        <v-btn icon @click="bottomSheetAberto = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card class="pa-4">
        <!-- DADOS PESSOAIS -->
        <div v-show="abaAtiva === 'dadosPessoais'">
          <v-text-field v-model="cliente.nome" label="Nome" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.sobrenome" label="Sobrenome" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.telefone" label="Telefone" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.email" label="E-mail" type="email" variant="outlined" density="compact" />
        </div>

        <!-- LOGIN & SENHA -->
        <div v-show="abaAtiva === 'loginSenha'">
          <v-text-field v-model="cliente.email" label="E-mail" variant="outlined" density="compact" />
          <v-btn @click="abaAtiva = 'trocarSenha'" class="btn-lacoste mt-4">Trocar Senha</v-btn>
        </div>

        <!-- TROCAR SENHA -->
        <div v-show="abaAtiva === 'trocarSenha'">
          <v-text-field v-model="senhaAtual" label="Senha Atual" type="password" variant="outlined" density="compact" />
          <v-text-field v-model="novaSenha" label="Nova Senha" type="password" variant="outlined" density="compact" />
          <v-text-field v-model="confirmarSenha" label="Confirmar Senha" type="password" variant="outlined" density="compact" />
        </div>

        <!-- ENDEREÇOS -->
        <div v-show="abaAtiva === 'enderecoEntrega'">
          <v-text-field v-model="cliente.endereco.cep" label="CEP" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.endereco.rua" label="Endereço" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.endereco.numero" label="Número" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.endereco.complemento" label="Complemento" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.endereco.bairro" label="Bairro" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.endereco.estado" label="Estado" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.endereco.cidade" label="Cidade" variant="outlined" density="compact" />
          <v-text-field v-model="cliente.endereco.telefone" label="Telefone" variant="outlined" density="compact" />
        </div>
      </v-card>

      <v-toolbar class="toolbar-footer" flat>
        <router-link to="/perfilCliente" @click="bottomSheetAberto = false" class="rota-texto">Cancelar</router-link>
        <v-spacer />
        <v-btn
          class="btn-lacoste pa-4"
          size="x-large"
          @click="fecharEConfirmar"
        >
          CONFIRMAR
        </v-btn>
      </v-toolbar>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import { useAuthStore } from "@/store/auth";
import { useEnderecoStore } from "@/store/endereco";

export default {
  data() {
    return {
      bottomSheetAberto: false,
      abaAtiva: null,
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
      cliente: {
        nome: "",
        sobrenome: "",
        email: "",
        telefone: "",
        endereco: {
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          telefone: ""
        }
      }
    };
  },

  computed: {
    authStore() {
      return useAuthStore();
    },
    enderecoStore() {
      return useEnderecoStore();
    },
    tituloSheet() {
      switch (this.abaAtiva) {
        case "dadosPessoais": return "INFORMAÇÕES PESSOAIS";
        case "loginSenha": return "LOGIN & SENHA";
        case "trocarSenha": return "TROCAR SENHA";
        case "enderecoEntrega": return "MEUS ENDEREÇOS";
        default: return "";
      }
    }
  },

  mounted() {
    this.carregarPerfil();
  },

  methods: {
    abrirBottomSheet(aba) {
      this.abaAtiva = aba;
      this.bottomSheetAberto = true;

      // Preenche o formulário com os dados atuais
      this.cliente = {
        nome: this.authStore.usuario.nome || "",
        sobrenome: this.authStore.usuario.sobrenome || "",
        email: this.authStore.usuario.email || "",
        telefone: this.authStore.usuario.telefone || "",
        endereco: { ...(this.enderecoStore.enderecos[0] || this.cliente.endereco) }
      };
    },

    async carregarPerfil() {
      if (this.authStore.estaLogado) {
        await this.enderecoStore.carregarEnderecos();
      }
    },

    async fecharEConfirmar() {
      try {
        if (this.abaAtiva === "dadosPessoais") {
          await fetch("http://192.168.18.136:2998/auth/me", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.authStore.token}`
            },
            body: JSON.stringify({
              nome: this.cliente.nome,
              sobrenome: this.cliente.sobrenome,
              email: this.cliente.email,
              telefone: this.cliente.telefone
            })
          });
        } else if (this.abaAtiva === "loginSenha") {
          if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
            return alert("Preencha todos os campos de senha.");
          }
          if (this.novaSenha !== this.confirmarSenha) {
            return alert("As senhas não coincidem.");
          }
          await fetch("http://192.168.18.136:2998/auth/me/senha", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.authStore.token}`
            },
            body: JSON.stringify({
              senhaAtual: this.senhaAtual,
              novaSenha: this.novaSenha
            })
          });
          this.senhaAtual = "";
          this.novaSenha = "";
          this.confirmarSenha = "";
        } else if (this.abaAtiva === "enderecoEntrega") {
          const enderecoAtual = this.cliente.endereco;
          if (enderecoAtual._id) {
            await this.enderecoStore.atualizarEndereco(enderecoAtual._id, enderecoAtual);
          } else {
            await this.enderecoStore.adicionarEndereco(enderecoAtual);
          }
        }

        await this.carregarPerfil();
        this.bottomSheetAberto = false;
        alert("Atualização realizada com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao atualizar dados.");
      }
    }
  }
};
</script>


<style scoped>
/* Container */
.perfil-container {
  background-color: #f5f5f5;
  padding: 20px;
}

/* Título */
.titulo-principal {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #002D18;
}
.descricao {
  font-size: 0.95rem;
  color: #555;
}

/* Cards */
.card-lacoste {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.card-header {
  font-weight: bold;
  color: #002D18;
}
.titulo-card {
  font-weight: bold;
  font-size: 1rem;
}
.btn-icone {
  color: #002D18;
}

/* Labels */
.label {
  font-weight: 600;
  color: #333;
}

/* Toolbar do BottomSheet */
.toolbar-lacoste {
  background-color: #002D18;
  color: white;
}
.toolbar-footer {
  padding: 10px;
  border-top: 1px solid #ddd;
}

/* Botão estilo Lacoste */
.btn-lacoste {
  background-color: #002D18 !important;
  color: white !important;
  font-weight: bold;
  border-radius: 0;
  text-transform: uppercase;
}
.btn-lacoste:hover {
  opacity: 0.9;
}

/* Link de cancelar */
.rota-texto {
  text-decoration: none;
  color: #002D18;
  font-weight: 500;
}
.rota-texto:hover {
  text-decoration: underline;
}
</style>
