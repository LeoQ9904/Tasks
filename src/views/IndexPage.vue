<template>
  <ion-page>
    <HeaderComponent :title="$route.params.id as string" />

    <ion-content :fullscreen="true" class="">
      <CategoryComponent
        :categories="categoriesWithNew"
        :selectedCategory="selectedCategory"
        @openNewListModal="
          showNewListModal = !authStore.isLoggedIn ? false : true
        "
        @selectCategory="selectCategory"
      />

      <div class="ion-padding">
        <!-- Sección de tareas pendientes -->
        <TasksComponent
          :tasks="pendingTasks"
          :title="currentCategoryName"
          :selectedCategory="selectedCategory"
          :listCompleted="false"
          @deleteCategory="handleDeleteCategory"
          @editCategory="handleEditCategory"
        />

        <!-- Sección de tareas completadas -->
        <TasksComponent
          class="completed-section"
          v-if="completedTasks.length > 0"
          :tasks="completedTasks"
          title="Tareas Completadas"
          :selectedCategory="selectedCategory"
          :listCompleted="true"
        />
      </div>
    </ion-content>

    <!-- Botón flotante para agregar nueva tarea -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button
        @click="openNewTaskModal"
        color="primary"
        :disabled="!authStore.isLoggedIn"
      >
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- Modal para crear nueva tarea -->
    <NewTasksComponent
      :showNewTaskModal="showNewTaskModal"
      @closeNewTaskModal="showNewTaskModal = false"
      @createNewTask="createNewTask"
    />

    <!-- Modal para crear nueva lista -->
    <NewCategoryComponent
      :showNewListModal="showNewListModal"
      :editingCategory="currentEditingCategory"
      @closeNewListModal="handleCloseModal"
      @createNewList="createNewList"
      @editCategory="handleEditCategorySubmit"
    />
  </ion-page>
</template>

<script setup lang="ts">
  import {
    IonContent,
    IonPage,
    IonIcon,
    IonFab,
    IonFabButton,
  } from '@ionic/vue';
  import { add } from 'ionicons/icons';
  import { ref, computed, watch } from 'vue';
  import { useCategoryStore } from '@/stores/categories';
  import { useTaskStore } from '@/stores/tasks';
  import { useAuthStore } from '@/stores/auth';
  import HeaderComponent from '@/components/HeaderComponent.vue';
  import CategoryComponent from '@/components/CategoryComponent.vue';
  import TasksComponent from '@/components/TasksComponent.vue';
  import NewCategoryComponent from '@/components/NewCategoryComponent.vue';
  import NewTasksComponent from '@/components/NewTasksComponent.vue';

  // Stores de Pinia
  const categoryStore = useCategoryStore();
  const taskStore = useTaskStore();
  const authStore = useAuthStore();

  // Estado reactivo local
  const selectedCategory = ref<string | null>(null);
  const showNewListModal = ref(false);
  const showNewTaskModal = ref(false);
  const editingCategory = ref<string | null>(null);

  // Computed para categorías con opción de "Nueva lista"
  const categoriesWithNew = computed(() => {
    const cats = categoryStore.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
    }));

    // Agregar opción "Nueva lista" al final
    cats.push({
      id: 'new',
      name: 'Nueva lista',
      color: '#6b7280',
    });

    return cats;
  });

  // Computed para tareas de la categoría seleccionada
  const categoryTasks = computed(() => {
    if (!selectedCategory.value || selectedCategory.value === 'new') {
      return [];
    }
    return taskStore.getTasksByCategory(selectedCategory.value);
  });

  // Computed para tareas separadas por estado de la categoría seleccionada
  const pendingTasks = computed(() => {
    if (!selectedCategory.value || selectedCategory.value === 'new') {
      return [];
    }
    return categoryTasks.value.filter(task => !task.completed);
  });

  const completedTasks = computed(() => {
    if (!selectedCategory.value || selectedCategory.value === 'new') {
      return [];
    }
    return categoryTasks.value.filter(task => task.completed);
  });

  // Computed para el título de la sección
  const currentCategoryName = computed(() => {
    if (!selectedCategory.value || selectedCategory.value === 'new') {
      return 'Tareas';
    }
    const category = categoryStore.getCategoryById(selectedCategory.value);
    return category?.name || 'Tareas';
  });

  // Computed para obtener la categoría que se está editando
  const currentEditingCategory = computed(() => {
    if (!editingCategory.value) return null;
    return categoryStore.getCategoryById(editingCategory.value);
  });

  // Funciones
  const selectCategory = (index: number) => {
    // Si es "Nueva lista" (último elemento), abrir modal
    if (index === categoriesWithNew.value.length - 1) {
      showNewListModal.value = true;
      return;
    }

    // Seleccionar la categoría por ID
    const category = categoriesWithNew.value[index];
    if (category && category.id !== 'new') {
      selectedCategory.value = category.id;
    }
  };

  const createNewList = async (val: string) => {
    if (val.trim()) {
      const newCategory = await categoryStore.createCategory({
        name: val.trim(),
        color: '#6b7280',
      });

      if (newCategory) {
        selectedCategory.value = newCategory.id;
        console.log(
          '✅ Nueva categoría creada y seleccionada:',
          newCategory.name
        );
      }
    }
  };

  const openNewTaskModal = () => {
    showNewTaskModal.value = true;
  };

  const createNewTask = async (taskData: {
    title: string;
    description: string;
    dueDate: Date | null;
  }) => {
    if (taskData.title.trim()) {
      let categoryId: string | null = selectedCategory.value;

      // Si no hay categoría seleccionada, crear/usar la predeterminada
      if (!categoryId || categoryId === 'new') {
        try {
          categoryId = await categoryStore.ensureDefaultCategory();
          selectedCategory.value = categoryId;
        } catch (error) {
          console.error('❌ Error al crear categoría predeterminada:', error);
          // Continuar sin categoría si falla
          categoryId = null;
        }
      }

      const newTask = await taskStore.createTask({
        title: taskData.title,
        description: taskData.description || undefined,
        categoryId: categoryId || undefined,
        priority: 'medium',
        dueDate: taskData.dueDate || null,
      });

      if (newTask) {
        console.log('✅ Nueva tarea creada:', newTask.title);
      }
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    categoryStore.deleteCategory(categoryId);
  };

  const handleEditCategory = (categoryId: string) => {
    editingCategory.value = categoryId;
    showNewListModal.value = true;
    console.log('📝 Editar categoría:', categoryId);
  };

  const handleEditCategorySubmit = async (newName: string) => {
    if (editingCategory.value && newName.trim()) {
      await categoryStore.updateCategory(editingCategory.value, {
        name: newName.trim(),
      });
      console.log('✅ Categoría editada:', newName);
    }
    // Limpiar estado de edición
    editingCategory.value = null;
  };

  const handleCloseModal = () => {
    editingCategory.value = null;
    showNewListModal.value = false;
  };

  watch(
    () => categoryStore.categories,
    async newCategories => {
      console.log('🔄 Nuevas categorías detectadas:', newCategories);
      selectedCategory.value =
        newCategories.length > 0 ? newCategories[0].id : null;
    }
  );
</script>

<style scoped>
  /* Botón flotante */
  ion-fab {
    margin: 16px;
  }

  ion-fab-button {
    --background: #4a5568;
    --color: #ffffff;
    --box-shadow: 0 4px 12px rgba(74, 85, 104, 0.4);
    width: 56px;
    height: 56px;
  }

  ion-fab-button:hover {
    --background: #2d3748;
    --box-shadow: 0 6px 16px rgba(74, 85, 104, 0.6);
  }
</style>
