<template>
  <ion-page class="welcome-page">
    <ion-content :fullscreen="true" class="welcome-content">
      <div class="welcome-container">
        <!-- Logo/Icono de la aplicación -->
        <div class="logo-section">
          <img src="/icon.png" alt="Tasks Logo" class="app-logo" />
          <h1 class="app-title">Tasks</h1>
          <p class="app-subtitle">Organiza tu vida, una tarea a la vez</p>
        </div>

        <!-- Descripción de la aplicación -->
        <div class="features-section">
          <div class="feature-item">
            <ion-icon :icon="listOutline" class="feature-icon"></ion-icon>
            <h3>Organiza tus tareas</h3>
            <p>
              Crea listas y categorías personalizadas para mantener todo en
              orden
            </p>
          </div>

          <div class="feature-item">
            <ion-icon :icon="timeOutline" class="feature-icon"></ion-icon>
            <h3>Nunca olvides nada</h3>
            <p>
              Establece recordatorios y fechas límite para tus tareas
              importantes
            </p>
          </div>

          <div class="feature-item">
            <ion-icon :icon="cloudOutline" class="feature-icon"></ion-icon>
            <h3>Sincronización en la nube</h3>
            <p>
              Accede a tus tareas desde cualquier dispositivo, siempre
              sincronizado
            </p>
          </div>
        </div>

        <!-- Botón de inicio de sesión -->
        <div class="auth-section">
          <ion-button
            expand="block"
            size="large"
            class="login-button"
            @click="handleLogin"
            :disabled="isLoading"
          >
            <ion-icon :icon="logoGoogle" slot="start"></ion-icon>
            {{
              isLoading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'
            }}
          </ion-button>

          <p class="privacy-text">
            Al iniciar sesión, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </ion-content>

    <!-- Footer -->
    <FooterComponent />
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
  import {
    listOutline,
    timeOutline,
    cloudOutline,
    logoGoogle,
  } from 'ionicons/icons';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import FooterComponent from '@/components/FooterComponent.vue';

  const authStore = useAuthStore();
  const router = useRouter();
  const isLoading = ref(false);

  const handleLogin = async () => {
    try {
      isLoading.value = true;
      const result = await authStore.login();

      if (result.success) {
        router.replace('/folder/Tareas');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style>
  /* Estilos globales para usar tema estándar */
  ion-page.welcome-page {
    background: var(--ion-background-color) !important;
  }

  ion-page.welcome-page ion-content {
    --background: var(--ion-background-color) !important;
    background: var(--ion-background-color) !important;
  }
</style>

<style scoped>
  .welcome-content {
    --background: var(--ion-background-color) !important;
    background: var(--ion-background-color) !important;
  }

  .welcome-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 2rem;
    color: var(--ion-text-color) !important;
    background: var(--ion-background-color);
    width: 100%;
    box-sizing: border-box;
  }

  .logo-section {
    text-align: center;
    margin-bottom: 3rem;
  }

  .app-logo {
    width: 80px;
    height: 80px;
    margin-bottom: 1rem;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .app-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    color: var(--ion-color-primary) !important;
  }

  .app-subtitle {
    font-size: 1.2rem;
    opacity: 0.8;
    margin: 0;
    font-weight: 300;
    color: var(--ion-text-color) !important;
  }

  .features-section {
    max-width: 400px;
    margin-bottom: 3rem;
  }

  .feature-item {
    text-align: center;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }

  .feature-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: var(--ion-color-primary) !important;
    opacity: 0.9;
  }

  .feature-item h3 {
    font-size: 1.2rem;
    margin: 0.5rem 0;
    font-weight: 600;
    color: var(--ion-text-color) !important;
  }

  .feature-item p {
    font-size: 0.9rem;
    opacity: 0.7;
    margin: 0;
    line-height: 1.4;
    color: var(--ion-text-color) !important;
  }

  .auth-section {
    width: 100%;
    max-width: 320px;
  }

  .login-button {
    --background: var(--ion-color-primary);
    --color: var(--ion-color-primary-contrast);
    --border-radius: 12px;
    --box-shadow: 0 4px 16px rgba(74, 85, 104, 0.2);
    height: 54px;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .login-button:hover {
    --background: var(--ion-color-primary-shade);
  }

  .privacy-text {
    text-align: center;
    font-size: 0.8rem;
    opacity: 0.6;
    margin: 0;
    line-height: 1.3;
    color: var(--ion-text-color) !important;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .welcome-container {
      padding: 1rem;
    }

    .app-logo {
      width: 60px;
      height: 60px;
    }

    .app-title {
      font-size: 2rem;
    }

    .features-section {
      margin-bottom: 2rem;
    }

    .feature-item {
      margin-bottom: 1.5rem;
    }
  }

  /* Animaciones */
  .welcome-container {
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .feature-item {
    animation: fadeInUp 0.8s ease-out;
    animation-fill-mode: both;
  }

  .feature-item:nth-child(1) {
    animation-delay: 0.2s;
  }
  .feature-item:nth-child(2) {
    animation-delay: 0.4s;
  }
  .feature-item:nth-child(3) {
    animation-delay: 0.6s;
  }

  .auth-section {
    animation: fadeInUp 0.8s ease-out 0.8s;
    animation-fill-mode: both;
  }
</style>
