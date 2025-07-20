import { watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCategoryStore } from '@/stores/categories';
import { useTaskStore } from '@/stores/tasks';

/**
 * Composable para manejar la inicialización automática de datos
 * cuando el usuario se autentica
 */
export const useDataInitializer = () => {
  const authStore = useAuthStore();
  const categoryStore = useCategoryStore();
  const taskStore = useTaskStore();

  // Observar cambios en el estado de autenticación
  watch(
    () => authStore.isLoggedIn,
    async (isLoggedIn, wasLoggedIn) => {
      if (isLoggedIn && !wasLoggedIn) {
        // Usuario acaba de iniciar sesión, cargar sus datos
        console.log('👤 Usuario autenticado, cargando datos...');

        try {
          // Cargar categorías y tareas en paralelo
          await Promise.all([
            categoryStore.loadCategories(),
            taskStore.loadTasks(),
          ]);

          categoryStore.ensureDefaultCategory();

          console.log('✅ Datos del usuario cargados correctamente');
        } catch (error) {
          console.error('❌ Error al cargar datos del usuario:', error);

          // Si es un error de permisos, mostrar mensaje específico
          if (error instanceof Error && error.message.includes('permissions')) {
            console.error(
              '🔒 Error de permisos de Firestore. Verifica las reglas de seguridad.'
            );
            console.error(
              '📋 Ve a Firebase Console → Firestore → Reglas y configura las reglas de desarrollo.'
            );
          }
        }
      } else if (!isLoggedIn && wasLoggedIn) {
        // Usuario acaba de cerrar sesión, limpiar datos
        console.log('👋 Usuario cerró sesión, limpiando datos...');
        categoryStore.clearCategories();
        taskStore.clearTasks();
      }
    },
    { immediate: false }
  );

  // Función para recargar todos los datos
  const refreshUserData = async () => {
    if (!authStore.isLoggedIn) {
      console.warn('No hay usuario autenticado para recargar datos');
      return;
    }

    try {
      await Promise.all([
        categoryStore.loadCategories(),
        taskStore.loadTasks(),
      ]);
      console.log('✅ Datos del usuario recargados');
    } catch (error) {
      console.error('❌ Error al recargar datos:', error);
    }
  };

  return {
    refreshUserData,
  };
};
