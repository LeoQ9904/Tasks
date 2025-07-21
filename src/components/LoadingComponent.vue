<template>
  <ion-page>
    <ion-content class="">
      <div class="loading-container">
        <ion-spinner name="crescent" class="loading-spinner"></ion-spinner>
        <h2>Cargando...</h2>
        <p>Verificando tu sesión</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonContent, IonSpinner } from '@ionic/vue';
</script>

<style scoped>
  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .loading-spinner {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .loading-container h2 {
    margin: 0.5rem 0;
    font-weight: 600;
  }

  .loading-container p {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }
</style>
