<template>
  <!-- Navbar Mobile -->
    <HomeLacosteMobile v-if="$vuetify.display.smAndDown" />

    <!-- Navbar Desktop -->
    <HomeLacoste v-else />
    
    <router-view />
</template>

<script setup>
import HomeLacoste from '@/components/Lacoste/HomeLacoste.vue';
import HomeLacosteMobile from '@/components/Lacoste/HomeLacosteMobile.vue';
</script>
