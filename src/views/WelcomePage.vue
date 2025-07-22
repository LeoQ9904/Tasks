<template>
  <ion-page class="welcome-page">
    <ion-content :fullscreen="true" class="welcome-content">
      <div class="welcome-container">
        <!-- Logo principal -->
        <div class="logo-section">
          <div class="logo-wrapper">
            <img src="/icon.png" alt="Tasks Logo" class="app-logo" />
          </div>
          <h1 class="app-title">Tasks</h1>
          <p class="app-subtitle">Tu productividad, simplificada</p>
        </div>

        <!-- Características minimalistas -->
        <div class="features-section">
          <div class="feature-grid">
            <div class="feature-card">
              <ion-icon :icon="listOutline" class="feature-icon"></ion-icon>
              <span>Organizar</span>
            </div>
            <div class="feature-card">
              <ion-icon :icon="timeOutline" class="feature-icon"></ion-icon>
              <span>Recordar</span>
            </div>
            <div class="feature-card">
              <ion-icon :icon="cloudOutline" class="feature-icon"></ion-icon>
              <span>Sincronizar</span>
            </div>
          </div>
        </div>

        <!-- Botón de login principal -->
        <div class="auth-section">
          <ion-button
            expand="block"
            size="large"
            class="login-button"
            @click="handleLogin"
            :disabled="isLoading"
          >
            <ion-icon :icon="logoGoogle" slot="start"></ion-icon>
            <span class="button-text">
              {{ isLoading ? 'Conectando...' : 'Continuar con Google' }}
            </span>
          </ion-button>

          <p class="privacy-text">Seguro y privado</p>
        </div>
        <!-- Footer -->
        <FooterComponent />
      </div>
    </ion-content>
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
  /* Estilos globales con fondo blanco y matices grises */
  ion-page.welcome-page {
    background: linear-gradient(
      135deg,
      #ffffff 0%,
      #f8fafc 50%,
      #f1f5f9 100%
    ) !important;
  }

  ion-page.welcome-page ion-content {
    --background: linear-gradient(
      135deg,
      #ffffff 0%,
      #f8fafc 50%,
      #f1f5f9 100%
    ) !important;
    background: linear-gradient(
      135deg,
      #ffffff 0%,
      #f8fafc 50%,
      #f1f5f9 100%
    ) !important;
  }
</style>

<style scoped>
  .welcome-content {
    --background: linear-gradient(
      135deg,
      #ffffff 0%,
      #f8fafc 50%,
      #f1f5f9 100%
    ) !important;
    background: linear-gradient(
      135deg,
      #ffffff 0%,
      #f8fafc 50%,
      #f1f5f9 100%
    ) !important;
  }

  .welcome-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 2rem;
    color: #1e293b;
    background: transparent;
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }

  /* Logo section con efecto glassmorphism */
  .logo-section {
    text-align: center;
    margin-bottom: 4rem;
  }

  .logo-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 1.5rem;
  }

  .app-logo {
    width: 100px;
    height: 100px;
    border-radius: 24px;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
  }

  .app-logo:hover {
    transform: scale(1.05);
  }

  .app-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    color: #1e293b;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    letter-spacing: -0.02em;
  }

  .app-subtitle {
    font-size: 1.3rem;
    margin: 0;
    font-weight: 300;
    color: #64748b;
    text-shadow: none;
  }

  /* Features con diseño de cards minimalistas */
  .features-section {
    margin-bottom: 4rem;
  }

  .feature-grid {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
  }

  .feature-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    min-width: 100px;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    border-color: rgba(0, 0, 0, 0.15);
  }

  .feature-icon {
    font-size: 2.5rem;
    color: #3b82f6;
    filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3));
  }

  .feature-card span {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    text-align: center;
  }

  /* Botón de login con diseño vibrante */
  .auth-section {
    width: 100%;
    max-width: 350px;
  }

  .login-button {
    --background: none;
    --color: white;
    --border-radius: 50px;
    height: 64px;
    font-weight: 700;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    border: none;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .login-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }

  .login-button:hover {
    --background: linear-gradient(45deg, #3367d6, #2d8f47);
    transform: translateY(-2px);
    --box-shadow: 0 12px 40px rgba(66, 133, 244, 0.5);
  }

  .login-button:hover::before {
    left: 100%;
  }

  .login-button:active {
    transform: translateY(0);
  }

  .login-button ion-icon {
    font-size: 1.4rem;
    margin-right: 0.5rem;
  }

  .button-text {
    font-weight: 700;
  }

  .privacy-text {
    text-align: center;
    font-size: 0.9rem;
    margin: 0;
    color: #64748b;
    font-weight: 500;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .welcome-container {
      padding: 1.5rem;
    }

    .app-logo {
      width: 80px;
      height: 80px;
    }

    .app-title {
      font-size: 2.8rem;
    }

    .app-subtitle {
      font-size: 1.1rem;
    }

    .feature-grid {
      gap: 1rem;
    }

    .feature-card {
      padding: 1rem;
      min-width: 80px;
    }

    .feature-icon {
      font-size: 2rem;
    }

    .feature-card span {
      font-size: 0.9rem;
    }

    .logo-section {
      margin-bottom: 3rem;
    }

    .features-section {
      margin-bottom: 3rem;
    }
  }

  @media (max-width: 480px) {
    .feature-grid {
      flex-direction: column;
      gap: 1.5rem;
    }

    .feature-card {
      flex-direction: row;
      min-width: 200px;
      padding: 1rem 1.5rem;
    }

    .feature-card span {
      margin-left: 0.5rem;
    }
  }

  /* Animaciones mejoradas */
  .welcome-container {
    animation: welcomeIn 1s ease-out;
  }

  @keyframes welcomeIn {
    from {
      opacity: 0;
      transform: translateY(50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .logo-section {
    animation: logoFloat 1.2s ease-out 0.3s both;
  }

  @keyframes logoFloat {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .feature-card {
    animation: cardSlideIn 0.8s ease-out both;
  }

  .feature-card:nth-child(1) {
    animation-delay: 0.6s;
  }
  .feature-card:nth-child(2) {
    animation-delay: 0.8s;
  }
  .feature-card:nth-child(3) {
    animation-delay: 1s;
  }

  @keyframes cardSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .auth-section {
    animation: buttonReveal 0.8s ease-out 1.2s both;
  }

  @keyframes buttonReveal {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Efectos adicionales */
  .welcome-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(
        circle at 20% 20%,
        rgba(59, 130, 246, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(147, 197, 253, 0.03) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: -1;
  }
</style>
