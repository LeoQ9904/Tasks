import { initializeApp } from 'firebase/app';
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
  } catch (error: any) {
    console.error('❌ Error en autenticación:', error);
    console.error('🔍 Código de error:', error.code);
    console.error('📝 Mensaje de error:', error.message);

    // Manejo específico de errores comunes
    if (error.code === 'auth/popup-blocked') {
      return {
        success: false,
        error: error,
        message:
          'Popup bloqueado. Por favor permite ventanas emergentes en tu navegador.',
      };
    }

    if (error.code === 'auth/popup-closed-by-user') {
      return {
        success: false,
        error: error,
        message: 'Autenticación cancelada por el usuario.',
      };
    }

    if (error.code === 'auth/cancelled-popup-request') {
      return {
        success: false,
        error: error,
        message: 'Solicitud de popup cancelada.',
      };
    }

    if (error.code === 'auth/unauthorized-domain') {
      return {
        success: false,
        error: error,
        message: 'Dominio no autorizado para autenticación.',
      };
    }

    if (error.code === 'auth/operation-not-supported-in-this-environment') {
      return {
        success: false,
        error: error,
        message:
          'Operación no soportada en este entorno. Verifica la configuración HTTPS.',
      };
    }

    // Manejo específico para disallowed_useragent
    if (
      error.message?.includes('disallowed_useragent') ||
      error.message?.includes('403')
    ) {
      return {
        success: false,
        error: error,
        message: `Error de autenticación en la aplicación. Por favor, abre la aplicación en tu navegador web en: ${import.meta.env.VITE_APP_WEB_URL || window.location.origin}`,
      };
    }

    return {
      success: false,
      error: error,
      message: 'Error durante la autenticación. Inténtalo de nuevo.',
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
