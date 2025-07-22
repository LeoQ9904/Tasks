// Tipos para las entidades de la aplicación

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  categoryId: string | null;
  userId: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para formularios (sin campos calculados)
export interface CreateCategoryData {
  name: string;
  color: string;
}

export interface UpdateCategoryData {
  name?: string;
  color?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string | null;
  categoryId?: string | null;
  priority?: 'low' | 'medium' | 'high';
  dueDate: Date | null;
}

export interface UpdateTaskData {
  title?: string;
  description: string | null;
  completed?: boolean;
  categoryId: string | null;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date | null;
}

// Tipos específicos para Firestore (con Timestamp)
export interface FirestoreCategoryData {
  name: string;
  color: string;
  userId: string;
  createdAt: import('firebase/firestore').Timestamp;
  updatedAt: import('firebase/firestore').Timestamp;
}

export interface FirestoreTaskData {
  title: string;
  description: string | null;
  completed: boolean;
  categoryId: string | null;
  userId: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: import('firebase/firestore').Timestamp | null;
  createdAt: import('firebase/firestore').Timestamp;
  updatedAt: import('firebase/firestore').Timestamp;
}
