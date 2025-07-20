<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-title slot="start">{{ title }}</ion-title>
      <ion-buttons slot="end">
        <ion-menu-toggle>
          <ion-button fill="clear">
            <ion-avatar>
              <img alt="Avatar" :src="authStore.userAvatar" />
            </ion-avatar>
          </ion-button>
        </ion-menu-toggle>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
  import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonMenuToggle,
    IonAvatar,
  } from '@ionic/vue';
  import { useAuthStore } from '@/stores/auth';
  import { onMounted } from 'vue';

  interface Props {
    title?: string;
  }

  withDefaults(defineProps<Props>(), {
    title: 'Tareas',
  });

  const authStore = useAuthStore();

  onMounted(async () => {
    if (!authStore.user) {
      await authStore.initializeAuth();
    }
  });
</script>

<style scoped>
  ion-header {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
    --box-shadow: none !important;
    --border-width: 0 !important;
  }

  ion-toolbar {
    --background: #ffffff !important;
    --color: #2d3748 !important;
    --border-color: transparent !important;
    background: #ffffff !important;
    color: #2d3748 !important;
    border-bottom: 1px solid #e2e8f0 !important;
  }

  ion-title {
    font-weight: 300;
    font-size: 2em;
    text-align: center;
    color: #2d3748 !important;
  }

  ion-avatar {
    width: 50px;
    height: 50px;
    border: 2px solid #e2e8f0;
  }

  ion-button {
    --padding-start: 8px;
    --padding-end: 8px;
    --color: #4a5568 !important;
    --background: transparent !important;
    --background-hover: rgba(74, 85, 104, 0.1) !important;
    --background-activated: rgba(74, 85, 104, 0.2) !important;
  }

  /* Forzar tema específico independientemente del dispositivo */
  :host {
    --ion-color-base: #ffffff !important;
    --ion-color-contrast: #2d3748 !important;
  }

  /* Asegurar que no se hereden estilos del tema del dispositivo */
  ion-header,
  ion-toolbar,
  ion-title,
  ion-button {
    color-scheme: light !important;
  }
</style>
