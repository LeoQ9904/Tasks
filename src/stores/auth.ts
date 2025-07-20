import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logout as firebaseLogout,
} from '@/services/firebase';

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null);
  const isLoading = ref(false);

  // Getters
  const isLoggedIn = computed(() => !!user.value);
  const userName = computed(() => user.value?.displayName || 'Usuario');
  const userEmail = computed(() => user.value?.email || '');
  const userAvatar = computed(
    () =>
      user.value?.photoURL ||
      'https://ionicframework.com/docs/img/demos/avatar.svg'
  );

  // Actions
  const initializeAuth = (): Promise<User | null> => {
    return new Promise(resolve => {
      isLoading.value = true;
      const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
        user.value = firebaseUser;
        isLoading.value = false;
        console.log(' Estado de autenticación actualizado:', !!firebaseUser);
        resolve(firebaseUser);
        unsubscribe();
      });
    });
  };
  const login = async () => {
    try {
      isLoading.value = true;
      console.log('🚀 Iniciando proceso de login...');

      const result = await loginWithGoogle();
      console.log('📋 Resultado del login:', result);

      if (result.success) {
        console.log('✅ Inicio de sesión exitoso');
        return { success: true };
      } else {
        console.error('❌ Error en el inicio de sesión:', result.error);
        return {
          success: false,
          error: result.error,
          message: result.message,
        };
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      return { success: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      isLoading.value = true;
      const result = await firebaseLogout();
      if (result.success) {
        user.value = null;

        // Limpiar datos de otros stores al cerrar sesión
        const { useCategoryStore } = await import('./categories');
        const { useTaskStore } = await import('./tasks');

        const categoryStore = useCategoryStore();
        const taskStore = useTaskStore();

        categoryStore.clearCategories();
        taskStore.clearTasks();

        console.log('✅ Cierre de sesión exitoso');
        return { success: true };
      } else {
        console.error('❌ Error al cerrar sesión:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      return { success: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const clearUser = () => {
    user.value = null;
  };

  return {
    // Estado
    user,
    isLoading,

    // Getters
    isLoggedIn,
    userName,
    userEmail,
    userAvatar,

    // Actions
    initializeAuth,
    login,
    logout,
    clearUser,
  };
});
