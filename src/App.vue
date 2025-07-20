<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <MenuComponent />
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
  import { IonApp, IonMenu, IonRouterOutlet, IonSplitPane } from '@ionic/vue';
  import MenuComponent from '@/components/MenuComponent.vue';
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
