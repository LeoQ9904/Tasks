# 📋 Listo App - Gestor de Tareas

Una aplicación moderna de gestión de tareas desarrollada con Vue.js, Ionic y Firebase. Permite organizar tareas por categorías, establecer fechas de vencimiento, y mantener un seguimiento completo de tu productividad.

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

## ✨ Características Principales

### 🎯 Gestión de Tareas

- ✅ Crear, editar y eliminar tareas
- 📅 Establecer fechas de vencimiento con selección de fecha y hora
- ✔️ Marcar tareas como completadas/pendientes
- 📝 Agregar descripciones detalladas a las tareas

### 📂 Organización por Categorías

- 🏷️ Crear categorías personalizadas con colores
- ✏️ Editar y eliminar categorías
- 📊 Visualización de tareas agrupadas por categoría

### 👤 Autenticación de Usuario

- 🔐 Autenticación segura con Google
- 👥 Datos privados por usuario
- 🔄 Sincronización automática en la nube

### 🎨 Interfaz de Usuario

- 📱 Diseño responsive para móviles y escritorio
- 🌙 Interfaz moderna con Ionic Components
- ⚡ Experiencia de usuario fluida y rápida
- 🎭 Animaciones y transiciones suaves

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Vue.js 3** - Framework progresivo de JavaScript
- **TypeScript** - Tipado estático para JavaScript
- **Ionic Vue** - Framework de UI para aplicaciones híbridas
- **Pinia** - Gestión de estado para Vue
- **Vue Router** - Enrutamiento oficial para Vue

### Backend y Base de Datos

- **Firebase Authentication** - Autenticación de usuarios
- **Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Hosting** - Hosting web escalable

### Herramientas de Desarrollo

- **Vite** - Build tool rápido y moderno
- **ESLint** - Linter para mantener calidad de código
- **Prettier** - Formateador de código automático
- **Cypress** - Testing end-to-end
- **Vitest** - Framework de testing unitario
- **Capacitor** - Para compilación nativa móvil

### Desarrollo Móvil

- **Capacitor** - Framework para aplicaciones nativas
- **Android** - Soporte nativo para Android
- Preparado para **iOS** (próximamente)

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Firebase
- Android Studio (para desarrollo móvil)

### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd Tasks
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication y Firestore
3. Configurar autenticación con Google
4. Crear archivo `src/services/firebase.ts` con tu configuración:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Tu configuración de Firebase
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

## 📱 Comandos Disponibles

### Desarrollo

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Construcción para producción
npm run preview          # Vista previa de la build
```

### Calidad de Código

```bash
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Corregir errores de ESLint automáticamente
npm run format           # Formatear código con Prettier
npm run code-quality     # Verificar calidad de código completa
npm run fix-all          # Corregir y formatear todo
```

### Testing

```bash
npm run test:unit        # Tests unitarios con Vitest
npm run test:e2e         # Tests end-to-end con Cypress
```

### Móvil (Android)

```bash
npx cap add android      # Añadir plataforma Android
npx cap run android      # Ejecutar en Android
npx cap build android    # Compilar para Android
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes Vue reutilizables
│   ├── CategoryComponent.vue
│   ├── HeaderComponent.vue
│   ├── TasksComponent.vue
│   ├── NewTasksComponent.vue
│   └── NewCategoryComponent.vue
├── composables/         # Composables de Vue
│   ├── useDataInitializer.ts
│   └── useDateFormatter.ts
├── router/              # Configuración de rutas
│   └── index.ts
├── services/            # Servicios de Firebase
│   ├── firebase.ts
│   └── firestore.ts
├── stores/              # Stores de Pinia
│   ├── auth.ts
│   ├── categories.ts
│   └── tasks.ts
├── types/               # Definiciones de TypeScript
│   └── index.ts
├── views/               # Páginas principales
│   ├── IndexPage.vue
│   └── FolderPage.vue
└── theme/               # Estilos y variables CSS
    └── variables.css
```

## 🔧 Configuración de ESLint y Prettier

El proyecto incluye configuración preestablecida para mantener calidad de código:

### ESLint

- Configurado para Vue 3 + TypeScript
- Reglas personalizadas para mantener consistencia
- Integración con Prettier para formateo automático

### Prettier

- Formateo automático al guardar
- Configuración unificada para todos los archivos
- Integración con VS Code

## 🎯 Funcionalidades Detalladas

### Gestión de Tareas

- **Crear Tarea**: Formulario con título, descripción, fecha de vencimiento y categoría
- **Editar Tarea**: Modificar cualquier campo de una tarea existente
- **Eliminar Tarea**: Borrado con confirmación
- **Completar Tarea**: Toggle entre pendiente/completada
- **Filtros**: Ver tareas pendientes y completadas por separado

### Sistema de Categorías

- **Crear Categoría**: Nombre personalizado y color identificativo
- **Editar Categoría**: Modificar nombre y color
- **Eliminar Categoría**: Con redistribución de tareas
- **Categoría por Defecto**: Sistema automático para tareas sin categoría

### Autenticación

- **Login con Google**: Autenticación OAuth2 segura
- **Persistencia**: Sesión mantenida automáticamente
- **Logout**: Cierre de sesión seguro
- **Estado Global**: Información de usuario accesible globalmente

## 🔐 Seguridad

- **Reglas de Firestore**: Solo los usuarios autenticados pueden acceder a sus datos
- **Autenticación Firebase**: Sistema de autenticación robusto y seguro
- **Datos Privados**: Cada usuario solo accede a sus propios datos
- **HTTPS**: Comunicación encriptada en producción

## 🚀 Deployment

### Web (Firebase Hosting)

```bash
npm run build
firebase deploy
```

### Android

```bash
npm run build
npx cap copy android
npx cap open android
# Compilar desde Android Studio
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autor

Desarrollado con ❤️ para mejorar la productividad personal.

---

⭐ Si este proyecto te ha sido útil, ¡no olvides darle una estrella!
