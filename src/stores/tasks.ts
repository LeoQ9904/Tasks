import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TaskService } from '@/services/firestore';
import { useAuthStore } from './auth';
import type { Task, CreateTaskData, UpdateTaskData } from '@/types';

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const tasksCount = computed(() => tasks.value.length);

  const completedTasks = computed(() =>
    tasks.value.filter(task => task.completed)
  );

  const pendingTasks = computed(() =>
    tasks.value.filter(task => !task.completed)
  );

  const completedTasksCount = computed(() => completedTasks.value.length);
  const pendingTasksCount = computed(() => pendingTasks.value.length);

  const getTaskById = computed(() => {
    return (id: string) => tasks.value.find(task => task.id === id);
  });

  const getTasksByCategory = computed(() => {
    return (categoryId: string) =>
      tasks.value.filter(task => task.categoryId === categoryId);
  });

  const getTasksByPriority = computed(() => {
    return (priority: 'low' | 'medium' | 'high') =>
      tasks.value.filter(task => task.priority === priority);
  });

  const tasksByDate = computed(() => {
    return [...tasks.value].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  const overdueTasks = computed(() => {
    const now = new Date();
    return tasks.value.filter(
      task => task.dueDate && new Date(task.dueDate) < now && !task.completed
    );
  });

  const loadTasks = async () => {
    const authStore = useAuthStore();
    if (!authStore.user?.uid) {
      console.warn('No hay usuario autenticado para cargar tareas');
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const userTasks = await TaskService.getTasks(authStore.user.uid);
      tasks.value = userTasks;

      console.log(`✅ ${userTasks.length} tareas cargadas`);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al cargar tareas';
      console.error('❌ Error al cargar tareas:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadTasksByCategory = async (categoryId: string) => {
    const authStore = useAuthStore();
    if (!authStore.user?.uid) {
      console.warn('No hay usuario autenticado para cargar tareas');
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const categoryTasks = await TaskService.getTasksByCategory(
        authStore.user.uid,
        categoryId
      );

      tasks.value = tasks.value.filter(task => task.categoryId !== categoryId);
      tasks.value.push(...categoryTasks);

      console.log(`✅ ${categoryTasks.length} tareas de categoría cargadas`);
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Error al cargar tareas de categoría';
      console.error('❌ Error al cargar tareas de categoría:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const createTask = async (data: CreateTaskData): Promise<Task | null> => {
    const authStore = useAuthStore();
    if (!authStore.user?.uid) {
      error.value = 'No hay usuario autenticado';
      return null;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const newTask = await TaskService.createTask(authStore.user.uid, data);
      tasks.value.unshift(newTask);

      console.log('✅ Tarea creada:', newTask.title);
      return newTask;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear tarea';
      console.error('❌ Error al crear tarea:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateTask = async (
    taskId: string,
    data: UpdateTaskData
  ): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      await TaskService.updateTask(taskId, data);

      const index = tasks.value.findIndex(task => task.id === taskId);
      if (index !== -1) {
        tasks.value[index] = {
          ...tasks.value[index],
          ...data,
          updatedAt: new Date(),
        };
      }

      console.log('✅ Tarea actualizada');
      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al actualizar tarea';
      console.error('❌ Error al actualizar tarea:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const toggleTaskCompletion = async (taskId: string): Promise<boolean> => {
    const task = tasks.value.find(t => t.id === taskId);
    if (!task) {
      error.value = 'Tarea no encontrada';
      return false;
    }

    try {
      const newCompletedState = !task.completed;
      await TaskService.toggleTaskCompletion(taskId, newCompletedState);

      task.completed = newCompletedState;
      task.updatedAt = new Date();

      console.log(
        `✅ Tarea ${newCompletedState ? 'completada' : 'marcada como pendiente'}`
      );
      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al cambiar estado de tarea';
      console.error('❌ Error al cambiar estado de tarea:', err);
      return false;
    }
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      await TaskService.deleteTask(taskId);

      tasks.value = tasks.value.filter(task => task.id !== taskId);

      console.log('✅ Tarea eliminada');
      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al eliminar tarea';
      console.error('❌ Error al eliminar tarea:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const clearTasks = () => {
    tasks.value = [];
    error.value = null;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // Estado
    tasks,
    isLoading,
    error,

    // Getters
    tasksCount,
    completedTasks,
    pendingTasks,
    completedTasksCount,
    pendingTasksCount,
    getTaskById,
    getTasksByCategory,
    getTasksByPriority,
    tasksByDate,
    overdueTasks,

    // Actions
    loadTasks,
    loadTasksByCategory,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    clearTasks,
    clearError,
  };
});
