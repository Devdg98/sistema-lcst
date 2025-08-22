<template>
    <div>
      <v-btn @click="openDialog">Cadastrar</v-btn>
  
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>Cadastrar Produto</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field label="Modelo" v-model="produto.modelo" required></v-text-field>
              <v-text-field label="Categoria" v-model="produto.categoria" required></v-text-field>
              <v-text-field label="Marca" v-model="produto.marca" required></v-text-field>
              <v-text-field label="Gênero" v-model="produto.genero" required></v-text-field>
              <v-text-field label="Valor" v-model="produto.valor" type="number" required></v-text-field>
              <v-file-input label="Fotos" v-model="produto.fotos" required></v-file-input>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="submitProduto">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialog: false,
        produto: {
          modelo: "",
          categoria: "",
          marca: "",
          genero: "",
          valor: null,
          fotos: null,
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
      async submitProduto() {
        if (this.$refs.form.validate()) {
          try {
            // Enviar os dados para o backend
            const response = await fetch("https://sua-api.com/produtos", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(this.produto),
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
          modelo: "",
          categoria: "",
          marca: "",
          genero: "",
          valor: null,
          fotos: null,
        };
      },
    },
  };
  </script>
  