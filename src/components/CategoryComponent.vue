<script setup lang="ts">
  import { add } from 'ionicons/icons';
  import { IonLabel, IonIcon, IonChip } from '@ionic/vue';

  interface Category {
    id: string;
    name: string;
    color?: string;
  }

  interface Props {
    categories: Category[];
    selectedCategory: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    categories: () => {
      return [];
    },
    selectedCategory: null,
  });

  const emit = defineEmits(['openNewListModal', 'selectCategory']);

  // Funciones
  const selectCategory = (index: number) => {
    if (index === props.categories.length - 1) {
      emit('openNewListModal');
      return;
    }
    emit('selectCategory', index);
  };
</script>
<template>
  <div class="horizontal-categories">
    <ion-chip
      v-for="(category, index) in props.categories"
      :key="category.id"
      :class="{ active: props.selectedCategory === category.id }"
      @click="selectCategory(index)"
    >
      <ion-icon v-if="category.id === 'new'" :icon="add"></ion-icon>
      <ion-label>{{ category.name }}</ion-label>
    </ion-chip>
  </div>
</template>
<style scoped>
  .horizontal-categories {
    display: flex;
    overflow-x: auto;
    padding: 10px;
    gap: 12px;
    background: var(--ion-background-color);
  }

  .horizontal-categories::-webkit-scrollbar {
    display: none;
  }

  ion-chip {
    --background: none !important;
    --color: var(--ion-text-color);
    min-width: fit-content;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 0 !important;
    --border-radius: 0 !important;
  }

  ion-chip:hover {
    --background: var(--ion-color-step-150);
  }

  ion-chip.active {
    --background: transparent;
    --color: #4a5568;
    border-bottom: 2px solid #4a5568 !important;
  }

  ion-chip.active ion-label {
    color: #4a5568 !important;
    font-weight: 600;
  }

  ion-chip ion-icon {
    margin-right: 8px;
  }

  ion-chip.active ion-icon {
    color: #4a5568 !important;
  }
</style>
