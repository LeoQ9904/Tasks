import { initializeApp, type FirebaseError } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validar que las variables de entorno están configuradas
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno de Firebase faltantes:', missingVars);
  console.error(
    'Por favor configura el archivo .env con las credenciales de Firebase'
  );
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Proveedores de autenticación
export const googleProvider = new GoogleAuthProvider();

// Configuración específica para móviles
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Funciones de autenticación
export const loginWithGoogle = async () => {
  try {
    console.log('🚀 Iniciando autenticación con Google...');
    console.log('🌐 User Agent:', navigator.userAgent);

    // Usar signInWithPopup para todas las plataformas
    const result = await signInWithPopup(auth, googleProvider);

    console.log('✅ Autenticación exitosa:', result.user?.email);
    return {
      success: true,
      user: result.user,
    };
  } catch (error: unknown) {
    // Type guard para verificar si es un FirebaseError
    if (error instanceof Error && 'code' in error) {
      const firebaseError = error as FirebaseError;
      console.error('❌ Error en autenticación:', firebaseError);
      console.error('🔍 Código de error:', firebaseError.code);
      console.error('📝 Mensaje de error:', firebaseError.message);

      return {
        success: false,
        error: {
          code: firebaseError.code,
          message: firebaseError.message,
        },
      };
    }

    // Error genérico
    console.error('❌ Error desconocido en autenticación:', error);
    return {
      success: false,
      error: {
        code: 'unknown',
        message: 'Error desconocido durante la autenticación',
      },
    };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error };
  }
};
