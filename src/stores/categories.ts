import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CategoryService } from '@/services/firestore';
import { useAuthStore } from './auth';
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types';

export const useCategoryStore = defineStore('categories', () => {
  // Estado
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const categoriesCount = computed(() => categories.value.length);

  const getCategoryById = computed(() => {
    return (id: string) => categories.value.find(cat => cat.id === id);
  });

  const categoriesByName = computed(() => {
    return [...categories.value].sort((a, b) => a.name.localeCompare(b.name));
  });

  // Actions
  const loadCategories = async () => {
    const authStore = useAuthStore();
    if (!authStore.user?.uid) {
      console.warn('No hay usuario autenticado para cargar categorías');
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const userCategories = await CategoryService.getCategories(
        authStore.user.uid
      );
      categories.value = userCategories;

      console.log(`✅ ${userCategories.length} categorías cargadas`);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al cargar categorías';
      console.error('❌ Error al cargar categorías:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const createCategory = async (
    data: CreateCategoryData
  ): Promise<Category | null> => {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn || !authStore.user?.uid) {
      error.value = 'No hay usuario autenticado';
      return null;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const newCategory = await CategoryService.createCategory(
        authStore.user.uid,
        data
      );
      categories.value.unshift(newCategory);

      console.log('✅ Categoría creada:', newCategory.name);
      return newCategory;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al crear categoría';
      console.error('❌ Error al crear categoría:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCategory = async (
    categoryId: string,
    data: UpdateCategoryData
  ): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      await CategoryService.updateCategory(categoryId, data);

      // Actualizar en el estado local
      const index = categories.value.findIndex(cat => cat.id === categoryId);
      if (index !== -1) {
        categories.value[index] = {
          ...categories.value[index],
          ...data,
          updatedAt: new Date(),
        };
      }

      console.log('✅ Categoría actualizada');
      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al actualizar categoría';
      console.error('❌ Error al actualizar categoría:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteCategory = async (categoryId: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      await CategoryService.deleteCategory(categoryId);

      // Remover del estado local
      categories.value = categories.value.filter(cat => cat.id !== categoryId);

      console.log('✅ Categoría eliminada');
      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al eliminar categoría';
      console.error('❌ Error al eliminar categoría:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const clearCategories = () => {
    categories.value = [];
    error.value = null;
  };

  const clearError = () => {
    error.value = null;
  };

  const ensureDefaultCategory = async (): Promise<string> => {
    console.log('🔄 Verificando categoría predeterminada...');
    const existingDefault = categories.value.find(
      cat => cat.name === 'Mis tareas'
    );

    if (existingDefault) {
      return existingDefault.id;
    }

    if (categories.value.length > 0) {
      return categories.value[0].id;
    }

    const defaultCategory = await createCategory({
      name: 'Mis tareas',
      color: '#6b7280',
    });

    if (defaultCategory) {
      console.log('✅ Categoría predeterminada creada:', defaultCategory.name);
      return defaultCategory.id;
    }

    throw new Error('No se pudo crear la categoría predeterminada');
  };

  return {
    // Estado
    categories,
    isLoading,
    error,

    // Getters
    categoriesCount,
    getCategoryById,
    categoriesByName,

    // Actions
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearCategories,
    clearError,
    ensureDefaultCategory,
  };
});
