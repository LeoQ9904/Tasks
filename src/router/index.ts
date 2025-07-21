import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/welcome',
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('../views/WelcomePage.vue'),
  },
  {
    path: '/folder/:id',
    component: () => import('../views/IndexPage.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const hasStoredSession = authStore.hasValidSession();

  if (hasStoredSession && !authStore.isLoading) {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth) {
      next();
      return;
    }

    if (to.path === '/welcome' && from.path === '/') {
      next('/folder/Tareas');
      return;
    }
  }

  if (authStore.isLoading || !hasStoredSession) {
    try {
      await authStore.initializeAuth();
    } catch (error) {
      console.error('Error inicializando auth:', error);
    }
  }

  const isLoggedIn = authStore.isLoggedIn;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn) {
    console.log('🔒 Ruta protegida, redirigiendo a welcome');
    next('/welcome');
    return;
  }

  if (isLoggedIn && to.path === '/welcome' && from.path === '/') {
    next('/folder/Tareas');
    return;
  }

  next();
});

export default router;
