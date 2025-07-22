import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logout as firebaseLogout,
} from '@/services/firebase';

export const useAuthStore = defineStore('auth', () => {
  // Constantes para localStorage
  const AUTH_SESSION_KEY = 'tasks_auth_session';

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

  // Funciones de localStorage
  const setSessionStorage = (userData: User) => {
    try {
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({
          isLoggedIn: true,
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error al guardar sesión en localStorage:', error);
    }
  };

  const getSessionStorage = () => {
    try {
      const sessionData = localStorage.getItem(AUTH_SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        // Verificar que la sesión no sea muy antigua (24 horas)
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas en ms
        if (Date.now() - parsed.timestamp < maxAge) {
          return parsed;
        } else {
          clearSessionStorage();
        }
      }
    } catch (error) {
      console.error('Error al leer sesión del localStorage:', error);
    }
    return null;
  };

  const clearSessionStorage = () => {
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  };

  const hasValidSession = () => {
    return !!getSessionStorage();
  };

  // Actions
  const initializeAuth = (): Promise<User | null> => {
    return new Promise(resolve => {
      isLoading.value = true;
      const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
        user.value = firebaseUser;

        if (firebaseUser) {
          // Guardar sesión en localStorage al autenticar
          setSessionStorage(firebaseUser);
        } else {
          // Limpiar localStorage si no hay usuario
          clearSessionStorage();
        }

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
          message: 'Error al iniciar sesión con Google',
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

        // Limpiar localStorage al cerrar sesión
        clearSessionStorage();

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

    // Funciones de localStorage
    hasValidSession,
    getSessionStorage,
    clearSessionStorage,
  };
});
