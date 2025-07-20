<script setup lang="ts">
  interface Props {
    showNewListModal: boolean;
    editingCategory?: {
      id: string;
      name: string;
      color: string;
    } | null;
  }

  import {
    IonContent,
    IonIcon,
    IonItem,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonInput,
  } from '@ionic/vue';
  import { close, checkmarkOutline } from 'ionicons/icons';
  import { ref, nextTick, computed, watch } from 'vue';

  const props = withDefaults(defineProps<Props>(), {
    showNewListModal: false,
    editingCategory: null,
  });

  const emit = defineEmits([
    'createNewList',
    'closeNewListModal',
    'editCategory',
  ]);

  const newListName = ref('');
  const inputRef = ref();

  const isEditMode = computed(() => !!props.editingCategory);

  const modalTitle = computed(() =>
    isEditMode.value ? 'Editar Categoría' : 'Nueva Categoría'
  );

  watch(
    () => props.editingCategory,
    category => {
      if (category) {
        newListName.value = category.name;
      } else {
        newListName.value = '';
      }
    },
    { immediate: true }
  );

  const closeNewListModal = () => {
    newListName.value = '';
    emit('closeNewListModal');
  };

  const createNewList = () => {
    if (isEditMode.value) {
      emit('editCategory', newListName.value.trim());
    } else {
      emit('createNewList', newListName.value.trim());
    }
    closeNewListModal();
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
</script>
<template>
  <ion-modal
    :is-open="props.showNewListModal"
    @did-dismiss="closeNewListModal"
    @did-present="onModalPresent"
    trigger="open-modal"
    :initial-breakpoint="0.25"
    :breakpoints="[0, 0.25, 0.5, 0.75]"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-icon
            @click="createNewList"
            :disabled="!newListName.trim()"
            :icon="checkmarkOutline"
            slot="start"
          ></ion-icon>
        </ion-buttons>
        <ion-title>{{ modalTitle }}</ion-title>
        <ion-buttons slot="end">
          <ion-icon
            @click="closeNewListModal"
            :icon="close"
            slot="start"
          ></ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="">
      <div>
        <ion-item>
          <ion-input
            ref="inputRef"
            v-model="newListName"
            placeholder="Nombre de la lista"
            clear-input
            :clear-on-edit="false"
          ></ion-input>
        </ion-item>
      </div>
    </ion-content>
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
</style>
