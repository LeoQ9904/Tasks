import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  Category,
  Task,
  CreateCategoryData,
  UpdateCategoryData,
  CreateTaskData,
  UpdateTaskData,
  FirestoreCategoryData,
  FirestoreTaskData,
} from '@/types';

// Interfaz para campos de actualización en Firestore
interface TaskUpdateFields {
  title?: string;
  description: string | null;
  completed?: boolean;
  categoryId: string | null;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Timestamp | null;
  updatedAt: Timestamp;
}

// Servicios para Categorías
export class CategoryService {
  private static COLLECTION = 'categories';

  static async getCategories(userId: string): Promise<Category[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Category[];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw new Error('No se pudieron cargar las categorías');
    }
  }

  static async createCategory(
    userId: string,
    data: CreateCategoryData
  ): Promise<Category> {
    try {
      const now = Timestamp.now();
      const categoryData: FirestoreCategoryData = {
        ...data,
        userId,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(
        collection(db, this.COLLECTION),
        categoryData
      );

      return {
        id: docRef.id,
        ...data,
        userId,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      };
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw new Error('No se pudo crear la categoría');
    }
  }

  static async updateCategory(
    categoryId: string,
    data: UpdateCategoryData
  ): Promise<void> {
    try {
      const categoryRef = doc(db, this.COLLECTION, categoryId);
      await updateDoc(categoryRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw new Error('No se pudo actualizar la categoría');
    }
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, categoryId));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw new Error('No se pudo eliminar la categoría');
    }
  }
}

// Servicios para Tareas
export class TaskService {
  private static COLLECTION = 'tasks';

  static async getTasks(userId: string): Promise<Task[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate() || null,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Task[];
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      throw new Error('No se pudieron cargar las tareas');
    }
  }

  static async getTasksByCategory(
    userId: string,
    categoryId: string
  ): Promise<Task[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('categoryId', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate() || null,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Task[];
    } catch (error) {
      console.error('Error al obtener tareas por categoría:', error);
      throw new Error('No se pudieron cargar las tareas de la categoría');
    }
  }

  static async createTask(userId: string, data: CreateTaskData): Promise<Task> {
    try {
      const now = Timestamp.now();
      const taskData: FirestoreTaskData = {
        ...data,
        userId,
        completed: false,
        priority: data.priority || 'medium',
        dueDate: data.dueDate ? Timestamp.fromDate(data.dueDate) : null,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), taskData);

      return {
        id: docRef.id,
        title: data.title,
        description: data.description,
        completed: false,
        categoryId: data.categoryId,
        userId,
        priority: data.priority || 'medium',
        dueDate: data.dueDate || undefined,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      };
    } catch (error) {
      console.error('Error al crear tarea:', error);
      throw new Error('No se pudo crear la tarea');
    }
  }

  static async updateTask(taskId: string, data: UpdateTaskData): Promise<void> {
    try {
      const taskRef = doc(db, this.COLLECTION, taskId);

      // Crear objeto de actualización con los tipos correctos
      const updateFields: Partial<TaskUpdateFields> = {
        updatedAt: Timestamp.now(),
      };

      // Agregar campos que no necesitan conversión
      if (data.title !== undefined) updateFields.title = data.title;
      if (data.description !== undefined) {
        updateFields.description = data.description;
      }
      if (data.completed !== undefined) updateFields.completed = data.completed;
      if (data.categoryId !== undefined) {
        updateFields.categoryId = data.categoryId;
      }
      if (data.priority !== undefined) updateFields.priority = data.priority;

      // Convertir dueDate a Timestamp si existe
      if (data.dueDate !== undefined) {
        updateFields.dueDate = data.dueDate
          ? Timestamp.fromDate(data.dueDate)
          : null;
      }

      await updateDoc(taskRef, updateFields);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      throw new Error('No se pudo actualizar la tarea');
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, taskId));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      throw new Error('No se pudo eliminar la tarea');
    }
  }

  static async toggleTaskCompletion(
    taskId: string,
    completed: boolean
  ): Promise<void> {
    try {
      const taskRef = doc(db, this.COLLECTION, taskId);
      await updateDoc(taskRef, {
        completed,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error al cambiar estado de tarea:', error);
      throw new Error('No se pudo cambiar el estado de la tarea');
    }
  }
}
