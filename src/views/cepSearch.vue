<template>
  <v-container>
    <v-card class="pa-4 elevation-2 rounded-lg">
      <v-card-title class="text-h5 font-weight-bold text-green-darken-3">
        <v-icon start>mdi-map-marker-outline</v-icon>
        Consulta de CEP
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="searchCep">
          <v-text-field
            v-model="cepInput"
            label="Digite o CEP (somente números)"
            placeholder="Ex: 01001000"
            :rules="[rules.required, rules.cep]"
            maxlength="8"
            counter
            variant="outlined"
            density="compact"
            class="mb-4"
          />
          <v-btn
            type="submit"
            color="green-darken-2"
            block
            :loading="cepStore.loading"
            class="text-white rounded-0"
          >
            Buscar Endereço
            <v-icon end>mdi-magnify</v-icon>
          </v-btn>
        </v-form>

        <v-alert
          v-if="cepStore.error"
          type="error"
          class="mt-4"
          icon="mdi-alert-circle-outline"
        >
          {{ cepStore.error }}
        </v-alert>

        <v-progress-linear
          v-if="cepStore.loading"
          indeterminate
          color="green-darken-3"
          class="mt-4"
        ></v-progress-linear>

        <div v-if="cepStore.address && !cepStore.error" class="mt-6">
          <h3 class="text-h6 mb-3 text-green-darken-4">Detalhes do Endereço:</h3>
          <v-list density="compact" class="transparent-list">
            <v-list-item>
              <v-list-item-title><strong>Logradouro:</strong> {{ cepStore.address.logradouro }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><strong>Bairro:</strong> {{ cepStore.address.bairro }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><strong>Cidade:</strong> {{ cepStore.address.localidade }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><strong>Estado (UF):</strong> {{ cepStore.address.uf }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><strong>DDD:</strong> {{ cepStore.address.ddd }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useCepStore } from '@/store/cepStore'; // Ajuste o caminho conforme necessário

const cepStore = useCepStore();
const cepInput = ref('');

// Regras de validação para o campo CEP
const rules = {
  required: value => !!value || 'Campo obrigatório.',
  cep: value => (value && value.length === 8 && /^\d+$/.test(value)) || 'CEP deve ter 8 dígitos numéricos.',
};

const searchCep = () => {
  if (cepInput.value && cepInput.value.length === 8 && /^\d+$/.test(cepInput.value)) {
    cepStore.fetchAddressByCep(cepInput.value);
  } else {
    cepStore.error = 'Por favor, insira um CEP válido de 8 dígitos.';
    cepStore.address = null;
  }
};
</script>

<style scoped>
.rounded-lg {
  border-radius: 12px;
}
.rounded-0 {
  border-radius: 0 !important;
}
.transparent-list {
  background-color: transparent !important;
}
</style>