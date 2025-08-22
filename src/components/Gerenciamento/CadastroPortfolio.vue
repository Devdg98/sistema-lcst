<template>
  <v-dialog v-model="cadastroServico" width="900px">
    <template #activator="{ props }">
      <v-btn block class="bg-blue-grey-darken-4" append-icon="mdi-cogs" v-bind="props">
        Novo Portfolio
      </v-btn>
    </template>
    <v-card>
  <v-card-title class="text-center text-h6 font-weight-bold mb-4">Visualizar/Alterar</v-card-title>

  <v-row v-for="(titulo, index) in objeto.titulos" :key="index">
    <v-col cols="12">
      <v-card>
        <v-card-title>{{ titulo.tituloServico }}</v-card-title>

        <!-- Adicionar nova descrição -->
        <v-text-field
          variant="outlined"
          density="comfortable"
          v-model="novaDescricao"
          label="Descrição do Serviço"
          prepend-inner-icon="mdi-comment-text-outline"
        ></v-text-field>
        <v-btn
          variant="outlined"
          color="green"
          @click="adicionarDescricao(index)"
          prepend-inner-icon="mdi-plus-circle-outline"
        >
          Adicionar Descrição
        </v-btn>

        <!-- Lista de descrições da categoria -->
        <v-list>
          <v-list-item
            v-for="(descricao, idx) in titulo.descricoes"
            :key="idx"
          >
            <v-list-item-content>{{ descricao }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-carousel
        v-if="dadosServicos.imagensServicos && dadosServicos.imagensServicos.length > 0"
        :continuous="true"
        :show-arrows="true"
        delimiter-icon="mdi-square"
        hide-delimiter-background
        height="200px"
      >
        <v-carousel-item
          v-for="(img, index) in dadosServicos.imagensServicos"
          :key="index"
          class="position-relative"
        >
          <v-img
            :src="`https://para-construcoes.s3.us-west-2.amazonaws.com/${img}`"
            :alt="`Imagem ${index + 1}`"
            class="carousel-image"
          ></v-img>
          <div class="position-absolute top-0 right-0">
            <v-btn icon color="red" @click="removerImagem(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-carousel-item>
      </v-carousel>

      <v-alert v-else type="info" class="mt-4">
        Nenhuma imagem disponível.
      </v-alert>

      <v-file-input
      variant="outlined"
        density="comfortable"
        label="Adicionar Imagens"
        v-model="imagensServico"
        multiple
        prepend-inner-icon="mdi-image-plus"
      ></v-file-input>
    </v-col>
  </v-row>

  <v-progress-linear
    v-if="progressoUpload"
    :value="progressoUpload"
    class="mt-4"
  ></v-progress-linear>

  <v-row dense>
    <v-col cols="12" md="4">
      <v-text-field
      variant="outlined"
        density="comfortable"
        v-model="novoTitulo.tituloServico"
        label="Título do Serviço"
        prepend-inner-icon="mdi-format-title"
      ></v-text-field>
    </v-col>

    <v-col cols="3" md="2">
      <v-btn
        block
        variant="outlined"

        color="blue"
        @click="adicionarTitulo"
        prepend-inner-icon="mdi-plus-circle-outline"
      >
        Adicionar
      </v-btn>
    </v-col>


  </v-row>
  <v-divider class="my-6" />
  <v-row justify="end" class="mt-4">
    <v-col cols="12" md="auto">
      <v-btn
      variant="outlined"
        text
        color="primary"
        class="mr-2"
        @click="cadastroServico = false"
        prepend-inner-icon="mdi-close-circle-outline"
      >
        Cancelar
      </v-btn>

      <v-btn
        outlined
        text
        color="secondary"
        @click="coletarServico"
        prepend-inner-icon="mdi-check-circle-outline"
      >
        Adicionar
      </v-btn>
    </v-col>
  </v-row>
</v-card>

  </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      cadastroServico: false,
      progressoUpload: 0,
      imagensServico: [],
      objeto: {
        titulos: [],
      },
      novoTitulo: {
        tituloServico: '',
        descricoes: []
      },
      novaDescricao: '',
      dadosServicos: {
        imagensServicos: [] // Inicializar corretamente para evitar undefined
      }
    };
  },
  watch: {
    cadastroServico(newVal) {
      if (newVal) {
        this.limparVariaveis();
      }
    }
  },
  methods: {
    adicionarTitulo() {
      if (this.novoTitulo.tituloServico) {
        this.objeto.titulos.push({
          ...this.novoTitulo,
          descricoes: []
        });

        this.novoTitulo = {
          tituloServico: '',
          descricoes: []
        };
      } else {
        alert('Preencha todos os Campos');
      }
    },
    adicionarDescricao(index) {
      if (this.novaDescricao) {
        this.objeto.titulos[index].descricoes.push(this.novaDescricao);
        this.novaDescricao = '';
      } else {
        alert('Preencha o campo de Descrição');
      }
    },
    async coletarServico() {
      try {
        const formData = new FormData();
        formData.append('titulos', JSON.stringify(this.objeto.titulos)); // Enviar os títulos como JSON string
        
        for (let i = 0; i < this.imagensServico.length; i++) {
          formData.append('imagensServicos', this.imagensServico[i]);
        }
        await axios.post('http://192.168.18.136:2999/portfolios', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: progressEvent => {
            this.progressoUpload = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          },
        });
        alert('Serviço Adicionado');
        this.cadastroServico = false;
        this.progressoUpload = 0;
      } catch (error) {
        console.error('Erro ao Adicionar Serviço', error.message);
        this.progressoUpload = 0;
      }
    },
    limparVariaveis() {
      this.objeto = {
        titulos: [],
      };
      this.novoTitulo = {
        tituloServico: '',
        descricoes: []
      };
      this.novaDescricao = '';
      this.dadosServicos = {
        imagensServicos: [] // Manter inicializado corretamente
      };
      this.imagensServico = [];
      this.progressoUpload = 0;
    }
  }
};
</script>
