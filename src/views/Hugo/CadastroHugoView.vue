<template>
    <div>
      <v-card>
          <v-card-title>Cadastrar Produto</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field label="Marca" v-model="produto.marcaProduto" required></v-text-field>
              <v-text-field label="Descricao" v-model="produto.descricaoProduto" required></v-text-field>
              <v-text-field label="Categoria" v-model="produto.categoriaProduto" required></v-text-field>
              <v-text-field label="Gênero" v-model="produto.generoProduto" required></v-text-field>
              <v-text-field label="Valor" v-model="produto.valorProduto" type="number" required></v-text-field>
              <v-text-field label="Valor Desconto" v-model="produto.valorDesconto" type="number" required></v-text-field>
              <v-file-input label="Fotos" v-model="produto.imagensProdutos" required multiple></v-file-input>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="submitProduto">Salvar</v-btn>
          </v-card-actions>
        </v-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialog: false,
        produto: {
          marcaProduto: "",
          descricaoProduto: "",
          categoriaProduto: "",
          generoProduto: "",
          valorDesconto: null,
          valorProduto: null,
          imagensProdutos: [],

        },
      };
    },
    methods: {
      openDialog() {
        this.dialog = true;
      },
      closeDialog() {
        this.dialog = false;
      },
      // ... dentro do método submitProduto ...
async submitProduto() {
  if (this.$refs.form.validate()) {
    try {
      const formData = new FormData();
      formData.append("marcaProduto", this.produto.marcaProduto);
      formData.append("descricaoProduto", this.produto.descricaoProduto);
      formData.append("categoriaProduto", this.produto.categoriaProduto);
      formData.append("generoProduto", this.produto.generoProduto);
      formData.append("valorProduto", this.produto.valorProduto);
      formData.append("valorDesconto", this.produto.valorDesconto);

      // Adiciona cada imagem ao FormData
      if (this.produto.imagensProdutos && this.produto.imagensProdutos.length > 0) {
        for (let i = 0; i < this.produto.imagensProdutos.length; i++) {
          formData.append("imagensProdutos", this.produto.imagensProdutos[i]);
        }
      }

      const response = await fetch("http://localhost:2999/produtos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o produto.");
      }

      alert("Produto cadastrado com sucesso!");
      this.closeDialog();
      this.resetForm();
    } catch (error) {
      alert("Houve um erro: " + error.message);
    }
  }
},
      resetForm() {
  this.produto = {
    marcaProduto: "",
    descricaoProduto: "",
    categoriaProduto: "",
    generoProduto: "",
    valorProduto: null,
    valorDesconto: null,
    imagensProdutos: [],
  };
    },
    },
  };
  </script>
  