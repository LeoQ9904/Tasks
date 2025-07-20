<template>
  <ion-content>
    <div class="menu-header">
      <ion-avatar>
        <img
          v-if="authStore.user?.photoURL"
          :alt="authStore.user?.displayName || 'Avatar'"
          :src="authStore.user.photoURL"
        />
        <img
          v-else
          alt="Avatar por defecto"
          src="https://ionicframework.com/docs/img/demos/avatar.svg"
        />
      </ion-avatar>
    </div>

    <!-- Contenido según estado de autenticación -->
    <div class="auth-section">
      <!-- Indicador de carga -->
      <div v-if="authStore.isLoading" class="loading-section">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Cargando...</p>
      </div>

      <!-- Si no ha iniciado sesión -->
      <div v-else-if="!authStore.isLoggedIn" class="login-section">
        <ion-button expand="block" fill="solid" @click="handleLogin">
          <ion-icon :icon="logoGoogle" slot="start"></ion-icon>
          Iniciar con Google
        </ion-button>
      </div>

      <!-- Si ya inició sesión -->
      <div v-else class="user-section">
        <p class="greeting">
          Hola {{ authStore.user?.displayName || 'Usuario' }}
        </p>
        <p class="email">{{ authStore.user?.email }}</p>
        <ion-button expand="block" fill="outline" @click="handleLogout">
          <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
          Cerrar Sesión
        </ion-button>
      </div>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
  import {
    IonContent,
    IonAvatar,
    IonButton,
    IonIcon,
    IonSpinner,
  } from '@ionic/vue';
  import { logoGoogle, logOutOutline } from 'ionicons/icons';
  import { useAuthStore } from '@/stores/auth';
  import { onMounted } from 'vue';

  const authStore = useAuthStore();

  // Inicializar autenticación al montar el componente
  onMounted(async () => {
    if (!authStore.user && !authStore.isLoading) {
      console.log('🔄 Inicializando autenticación...');
      await authStore.initializeAuth();
      if (!authStore.user) {
        console.log('❌ No hay usuario autenticado');
        await authStore.login();
        await authStore.initializeAuth();
      }
      console.log('✅ Autenticación finalizada');
    }
  });

  const handleLogin = async () => {
    await authStore.login();
    await authStore.initializeAuth();
  };

  const handleLogout = async () => {
    await authStore.logout();
  };
</script>

<style scoped>
  .menu-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 20px 30px 20px;
    width: 100%;
  }

  .menu-header ion-avatar {
    width: 120px;
    height: 120px;
    border: 3px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .menu-header ion-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .auth-section {
    padding: 30px 20px;
    text-align: center;
    width: 100%;
  }

  .loading-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: var(--ion-color-medium);
  }

  .greeting {
    font-size: 1.4em;
    font-weight: 600;
    color: var(--ion-text-color);
    margin: 0 0 8px 0;
  }

  .email {
    font-size: 0.9em;
    color: var(--ion-color-medium);
    margin: 0 0 24px 0;
  }

  .login-section,
  .user-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  ion-button {
    margin: 8px 0;
    --border-radius: 12px;
    width: 100%;
    max-width: 280px;
    --height: 48px;
    font-weight: 600;
  }

  /* Botón de Google */
  .login-section ion-button {
    --background: #4285f4;
    --background-hover: #3367d6;
    --background-activated: #2d5aa0;
    --color: #ffffff;
    --box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
  }

  /* Botón de cerrar sesión */
  .user-section ion-button {
    --background: transparent;
    --background-hover: #f8f9fa;
    --background-activated: #f1f3f4;
    --color: #5f6368;
    --border-color: #dadce0;
    --border-width: 1.5px;
  }

  ion-icon {
    margin-right: 8px;
  }
</style>
