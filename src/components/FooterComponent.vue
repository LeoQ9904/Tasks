<template>
  <ion-footer class="footer ion-no-border">
    <ion-toolbar class="footer-toolbar">
      <div class="footer-content">
        <div class="developer-info">
          <p class="footer-text">
            Desarrollado por <span class="developer-name">LeoQ9904</span>
          </p>
          <a class="footer-subtext" @click="openGitHub"
            >LystTask © {{ currentYear }}</a
          >
        </div>
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup lang="ts">
  import { IonFooter, IonToolbar } from '@ionic/vue';
  import { computed } from 'vue';

  const currentYear = computed(() => new Date().getFullYear());

  const openGitHub = () => {
    window.open('https://github.com/LeoQ9904', '_blank');
  };
</script>

<style scoped>
  .footer {
    position: relative;
    z-index: 10;
    box-shadow: none;
  }

  .footer-toolbar {
    --color: var(--ion-text-color);
    --padding-start: 0;
    --padding-end: 0;
    --min-height: auto;
    padding: 16px;
    --background: none !important;
  }

  ion-toolbar {
    border-bottom: none !important;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .developer-info {
    flex: 1;
  }

  .footer-text {
    margin: 0 0 4px 0;
    font-size: 0.875rem;
    color: var(--ion-text-color);
    opacity: 0.8;
    font-weight: 400;
  }

  .developer-name {
    font-weight: 600;
    color: var(--ion-color-primary);
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .developer-name:hover {
    opacity: 0.8;
  }

  .footer-subtext {
    margin: 0;
    font-size: 0.75rem;
    color: var(--ion-text-color);
    opacity: 0.6;
    font-weight: 300;
  }

  .footer-links {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .footer-link {
    --color: var(--ion-text-color);
    --padding-start: 8px;
    --padding-end: 8px;
    --padding-top: 8px;
    --padding-bottom: 8px;
    margin: 0;
    opacity: 0.7;
    transition: all 0.2s ease;
    --border-radius: 6px;
  }

  .footer-link:hover {
    opacity: 1;
    --color: var(--ion-color-primary);
    --background: var(--ion-color-step-100);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      text-align: center;
      gap: 12px;
      padding: 0 16px;
    }

    .footer-toolbar {
      padding: 20px 0;
    }

    .footer-text {
      font-size: 0.8rem;
    }

    .footer-subtext {
      font-size: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    .footer-content {
      padding: 0 12px;
    }

    .footer-text {
      font-size: 0.75rem;
    }

    .footer-subtext {
      font-size: 0.65rem;
    }

    .footer-toolbar {
      padding: 16px 0;
    }
  }

  /* Asegurar que el footer no se superponga con contenido flotante */
  .footer {
    margin-top: auto;
  }
</style>
