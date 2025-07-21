<template>
  <ion-app>
    <!-- Mostrar loading mientras se inicializa la autenticación -->
    <LoadingComponent v-if="authStore.isLoading" />

    <!-- Mostrar menú solo si el usuario está logueado -->
    <ion-split-pane content-id="main-content" v-else-if="authStore.isLoggedIn">
      <ion-menu content-id="main-content" type="overlay">
        <MenuComponent />
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>

    <!-- Sin menú para usuarios no autenticados -->
    <ion-router-outlet v-else id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script setup lang="ts">
  import { IonApp, IonMenu, IonRouterOutlet, IonSplitPane } from '@ionic/vue';
  import { onMounted } from 'vue';
  import MenuComponent from '@/components/MenuComponent.vue';
  import LoadingComponent from '@/components/LoadingComponent.vue';
  import { useAuthStore } from '@/stores/auth';

  const authStore = useAuthStore();

  // Inicializar la autenticación al cargar la app
  onMounted(async () => {
    await authStore.initializeAuth();
  });
</script>

<style scoped>
  /* Estilos generales del menú */
  ion-menu ion-content {
    --background: var(--ion-background-color);
  }

  ion-split-pane {
    --side-width: 280px;
  }
</style>
