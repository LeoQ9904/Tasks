<script setup lang="ts">
  import {
    IonList,
    IonItem,
    IonCheckbox,
    IonLabel,
    IonIcon,
    IonButton,
    IonPopover,
    IonContent,
  } from '@ionic/vue';
  import { checkboxOutline, ellipsisVertical } from 'ionicons/icons';
  import { useTaskStore } from '@/stores/tasks';
  import { useDateFormatter } from '@/composables/useDateFormatter';

  interface Props {
    tasks: Array<{
      id: string;
      title: string;
      description?: string;
      dueDate?: Date;
      completed: boolean;
      priority?: 'low' | 'medium' | 'high';
    }>;
    title: string;
    selectedCategory: string | null;
    listCompleted: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    tasks: () => [],
    title: 'Tareas Pendientes',
    selectedCategory: null,
  });

  const emit = defineEmits(['deleteCategory', 'editCategory']);

  const taskStore = useTaskStore();
  const { formatTaskDate } = useDateFormatter();

  // Funciones
  const toggleTask = async (taskId: string) => {
    await taskStore.toggleTaskCompletion(taskId);
  };

  const handleDeleteCategory = () => {
    if (props.selectedCategory) {
      emit('deleteCategory', props.selectedCategory);
    }
  };

  const handleEditCategory = () => {
    if (props.selectedCategory) {
      emit('editCategory', props.selectedCategory);
    }
  };
</script>
<template>
  <div class="tasks-container">
    <div class="section-header">
      <h3 class="section-title">
        {{ props.title }}
        <span class="task-count">({{ tasks.length }})</span>
      </h3>
      <ion-button
        v-if="props.selectedCategory && !props.listCompleted"
        fill="clear"
        size="small"
        id="category-menu-trigger"
        class="category-menu-button"
      >
        <ion-icon :icon="ellipsisVertical"></ion-icon>
      </ion-button>
    </div>
    <ion-list v-if="tasks.length > 0">
      <ion-item
        v-for="task in tasks"
        :key="task.id"
        lines="full"
        class="task-item"
      >
        <ion-checkbox
          slot="start"
          :checked="task.completed"
          @ionChange="toggleTask(task.id)"
        ></ion-checkbox>
        <ion-label>
          <h2>{{ task.title }}</h2>
          <p>{{ task.description }}</p>
          <p v-if="task.dueDate">{{ formatTaskDate(task.dueDate) }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
    <!-- Mensaje cuando no hay tareas pendientes -->
    <div v-else class="empty-state">
      <ion-icon :icon="checkboxOutline" size="large"></ion-icon>
      <p>No hay tareas pendientes en esta categoría</p>
    </div>

    <!-- Popover para menú de categoría -->
    <ion-popover
      v-if="props.selectedCategory && !props.listCompleted"
      trigger="category-menu-trigger"
      :dismiss-on-select="true"
    >
      <ion-content class="category-menu-content">
        <ion-item button @click="handleEditCategory" class="menu-item">
          <ion-label>Editar lista</ion-label>
        </ion-item>
        <ion-item
          button
          @click="handleDeleteCategory"
          class="menu-item delete-item"
          :disabled="tasks.length > 0"
        >
          <ion-label>Eliminar lista</ion-label>
        </ion-item>
      </ion-content>
    </ion-popover>
  </div>
</template>
<style scoped>
  /* Contenedor de tareas */
  .tasks-container {
    border-radius: 15px;
    padding: 12px;
    background-color: #ffffff;
    border: 0px solid #e2e8f0;
    box-shadow: 0 0px 1px rgba(0, 0, 0, 0.1);
  }

  /* Header de la sección con título y menú */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .section-title {
    font-size: 1.4em;
    font-weight: 600;
    color: var(--ion-text-color);
    margin: 0;
    flex: 1;
  }

  /* Botón del menú de categoría */
  .category-menu-button {
    --padding-start: 8px;
    --padding-end: 8px;
    --background: transparent !important;
    --background-hover: none !important;
    margin: 0;
    height: 32px;
    width: 32px;
  }

  .category-menu-button ion-icon {
    font-size: 18px;
    color: var(--ion-color-step-450);
  }

  .task-count {
    font-size: 0.9em;
    color: #4a5568;
    font-weight: 400;
  }

  /* Sección de tareas completadas */
  .completed-section {
    margin-top: 24px;
    background-color: #f8f9fa !important;
    border: 0px solid #e2e8f0;
  }

  .completed-title {
    color: #718096 !important;
    font-size: 1.2em !important;
  }

  .completed-item {
    opacity: 0.8;
  }

  .completed-item ion-label h2.completed {
    text-decoration: line-through;
    color: #a0aec0 !important;
  }

  .completed-desc {
    color: #cbd5e0 !important;
  }

  .completed-date {
    color: #718096 !important;
  }

  /* Lista de tareas */
  ion-list {
    background: transparent;
  }

  ion-item {
    --background: var(--ion-color-step-50);
    margin-bottom: 8px;
  }

  ion-item:hover {
    --background: var(--ion-color-step-100);
  }

  /* Estado de tarea completada */
  .completed {
    text-decoration: line-through;
    opacity: 0.6;
  }

  /* Checkbox personalizado - redondo */
  ion-checkbox {
    margin-right: 12px;
    --size: 22px;
    --checkbox-background: #ffffff;
    --checkbox-background-checked: #4a5568;
    --border-radius: 50%;
    --border-width: 2px;
    --border-color: #cbd5e0;
    --border-color-checked: #4a5568;
    --checkmark-color: #ffffff;
    --checkmark-width: 2px;
  }

  /* Etiqueta de tarea */
  ion-label h2 {
    font-size: 1.1em;
    font-weight: 500;
    color: var(--ion-text-color);
    margin: 0 0 4px 0;
  }

  ion-label p {
    font-size: 0.9em;
    color: var(--ion-color-medium);
    margin: 0;
  }

  /* Estado vacío */
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--ion-color-medium);
  }

  .empty-state ion-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .empty-state p {
    font-size: 1.1em;
    margin: 0;
  }

  /* Estilos para el menú de categoría */
  .category-menu-content {
    --padding-top: 8px;
    --padding-bottom: 8px;
  }

  .menu-item {
    --padding-start: 16px;
    --padding-end: 16px;
    --min-height: 44px;
    font-size: 14px;
  }

  .menu-item ion-icon {
    margin-right: 12px;
    font-size: 18px;
  }

  .delete-item {
    --color: var(--ion-color-danger);
  }

  .delete-item ion-icon {
    color: var(--ion-color-danger);
  }

  .delete-item ion-label {
    color: var(--ion-color-danger);
  }
</style>
