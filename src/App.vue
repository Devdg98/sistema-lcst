<template>
  <v-app>
    <v-navigation-drawer
    
      v-model="drawer"
      app
      temporary
      :style="{ backgroundColor: '#002D18' }"
    >
      <div class="text-center my-6">
        <v-avatar size="100">
          <v-img src="https://images-offstore.map.azionedge.net/compressed/3f0eb4d40704bfb0651d9bb7f9bc045c.jpg"></v-img>
        </v-avatar>
      </div>
      </v-navigation-drawer>

    <v-app-bar v-if="$vuetify.display.mobile" app color="#002D18" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Painel Administrativo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <gavNaveg />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import gavNaveg from './components/NavBarDesktop.vue';


const drawer = ref(false);
</script>