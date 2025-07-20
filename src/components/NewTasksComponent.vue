<script setup lang="ts">
  interface Props {
    showNewTaskModal: boolean;
  }
  import {
    IonContent,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonModal,
    IonItem,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonButtons,
    IonIcon,
  } from '@ionic/vue';
  import {
    checkmarkOutline,
    close,
    timeOutline,
    closeCircle,
    checkmarkCircle,
  } from 'ionicons/icons';
  import { ref, nextTick, computed } from 'vue';
  import { useDateFormatter } from '@/composables/useDateFormatter';

  const props = withDefaults(defineProps<Props>(), {
    showNewTaskModal: false,
  });

  const emit = defineEmits(['createNewTask', 'closeNewTaskModal']);

  // Variables para modal de nueva tarea
  const newTaskTitle = ref('');
  const newTaskDescription = ref('');
  const newTaskDueDate = ref('');
  const inputRef = ref();

  // Formateador de fechas
  const { formatTaskDate } = useDateFormatter();

  // Computed para mostrar la fecha seleccionada formateada
  const formattedSelectedDate = computed(() => {
    if (!newTaskDueDate.value.trim()) return '';
    try {
      const selectedDate = new Date(newTaskDueDate.value);
      return formatTaskDate(selectedDate);
    } catch (error) {
      return '';
    }
  });

  // Computed para el icono del reloj
  const timeIcon = computed(() => {
    return newTaskDueDate.value.trim() ? checkmarkCircle : timeOutline;
  });

  // Computed para el color del icono
  const timeIconColor = computed(() => {
    return newTaskDueDate.value.trim() ? 'success' : 'medium';
  });

  const closeNewTaskModal = () => {
    newTaskTitle.value = '';
    newTaskDescription.value = '';
    newTaskDueDate.value = '';
    emit('closeNewTaskModal');
  };

  const clearSelectedDate = () => {
    newTaskDueDate.value = '';
  };

  const createNewTask = () => {
    if (newTaskTitle.value.trim()) {
      const taskData = {
        title: newTaskTitle.value.trim(),
        description: newTaskDescription.value.trim(),
        dueDate: newTaskDueDate.value.trim()
          ? new Date(newTaskDueDate.value)
          : null,
      };
      emit('createNewTask', taskData);
    }
    closeNewTaskModal();
  };

  const onModalPresent = async () => {
    await nextTick();
    if (inputRef.value && inputRef.value.$el) {
      const inputElement = inputRef.value.$el.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  const modal = ref();
</script>
<template>
  <ion-modal
    :is-open="props.showNewTaskModal"
    @did-dismiss="closeNewTaskModal"
    @did-present="onModalPresent"
    trigger="open-modal"
    :initial-breakpoint="0.5"
    :breakpoints="[0, 0.25, 0.5, 0.75]"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-icon
            @click="createNewTask"
            :disabled="!newTaskTitle.trim()"
            :icon="checkmarkOutline"
            slot="start"
          ></ion-icon>
        </ion-buttons>
        <ion-title>Nueva Tarea</ion-title>
        <ion-buttons slot="end" style="padding-right: 1rem">
          <ion-icon
            :icon="timeIcon"
            :color="timeIconColor"
            slot="start"
            id="open-custom-dialog"
            class="time-icon-button"
          ></ion-icon>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-icon
            @click="closeNewTaskModal"
            :icon="close"
            slot="start"
          ></ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div>
        <ion-item>
          <ion-input
            ref="inputRef"
            v-model="newTaskTitle"
            placeholder="Título de la tarea"
            clear-input
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-textarea
            v-model="newTaskDescription"
            placeholder="Descripción"
            :rows="3"
          ></ion-textarea>
        </ion-item>

        <!-- Mostrar fecha seleccionada -->
        <ion-item v-if="formattedSelectedDate" class="selected-date-item">
          <div class="selected-date">
            <ion-icon :icon="timeOutline" class="date-icon"></ion-icon>
            <span class="date-text">{{ formattedSelectedDate }}</span>
            <ion-icon
              :icon="closeCircle"
              class="clear-date-icon"
              @click="clearSelectedDate"
            ></ion-icon>
          </div>
        </ion-item>
      </div>
    </ion-content>

    <!-- Modal para selección de fecha -->
    <ion-modal id="example-modal" ref="modal" trigger="open-custom-dialog">
      <IonDatetime
        v-model="newTaskDueDate"
        placeholder="Select Due Date"
        @click.stop
        presentation="date-time"
        :show-default-buttons="true"
      >
        <span slot="title">Seleccionar Fecha</span>
      </IonDatetime>
    </ion-modal>
  </ion-modal>
</template>
<style scoped>
  ion-header {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
    --box-shadow: none !important;
    --border-width: 0 !important;
  }
  ion-toolbar {
    --padding-end: 1rem !important;
    --padding-start: 1rem !important;
  }

  .time-icon-button {
    transition: all 0.3s ease;
    transform-origin: center;
  }

  .time-icon-button:hover {
    transform: scale(1.1);
  }

  ion-modal#example-modal {
    --width: fit-content;
    --min-width: 250px;
    --height: fit-content;
    --border-radius: 16px;
    background: none !important;
  }

  /* Estilos para la fecha seleccionada */
  .selected-date-item {
    --background: transparent;
    --padding-start: 16px;
    --padding-end: 16px;
    --border: none;
  }

  .selected-date {
    padding: 12px 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border: 1px solid var(--ion-color-step-150);
  }

  .date-icon {
    font-size: 18px;
    margin-right: 8px;
  }

  .date-text {
    font-size: 14px;
    font-weight: 500;
    flex: 1;
  }

  .clear-date-icon {
    font-size: 20px;
    margin-left: 8px;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  .clear-date-icon:hover {
    opacity: 1;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
