import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearUserOid } from "../../utils/oidUtils";

// Tipos de acciones
const AUTH_TYPES = {
  SET_AUTH_RESULT: 'SET_AUTH_RESULT',
  CLEAR_AUTH: 'CLEAR_AUTH',
  SET_LOADING: 'SET_LOADING',
};

// Estado inicial
const initialState = {
  authResult: null,
  isLoading: false,
  isInitialized: false,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_TYPES.SET_AUTH_RESULT:
      return {
        ...state,
        authResult: action.payload,
        isInitialized: true,
      };
    case AUTH_TYPES.CLEAR_AUTH:
      return {
        ...state,
        authResult: null,
        isInitialized: true,
      };
    case AUTH_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Contexto
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const appState = useRef(AppState.currentState);
  const b2cClientRef = useRef(null); // Referencia al cliente B2C

  // Efecto para manejar el ciclo de vida de la aplicación
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  // Función para manejar cambios en el estado de la aplicación
  const handleAppStateChange = async (nextAppState) => {
    // Cuando la app vuelve a estar activa, verificar si han pasado 3 días
    if (
      appState.current.match(/background|inactive/) && 
      nextAppState === 'active'
    ) {
      await checkSessionValidity();
    }
    
    // Actualizar la última actividad cuando la app está activa
    if (nextAppState === 'active') {
      await updateLastActivity();
    }
    
    appState.current = nextAppState;
  };

  // Función para realizar logout automático
  const performAutoLogout = async () => {
    try {
      // Limpiar todos los datos de sesión
      await AsyncStorage.removeItem("@msalToken");
      await AsyncStorage.removeItem("@lastActivity");
      await clearUserOid();
      
      // Actualizar el estado
      dispatch({ type: AUTH_TYPES.CLEAR_AUTH });
      
    } catch (error) {
      console.error('Error en logout automático:', error);
    }
  };

  // Función para verificar la validez de la sesión (3 días)
  const checkSessionValidity = async () => {
    try {
      const lastActivity = await AsyncStorage.getItem("@lastActivity");
      
      if (lastActivity) {
        const lastActivityDate = new Date(lastActivity);
        const currentDate = new Date();
        const diffInDays = (currentDate - lastActivityDate) / (1000 * 60 * 60 * 24);
        
        // Si han pasado más de 3 días, realizar logout automático
        if (diffInDays > 3) {
          await performAutoLogout();
        }
      }
    } catch (error) {
      console.error('Error verificando validez de sesión:', error);
    }
  };

  // Función para actualizar la última actividad
  const updateLastActivity = async () => {
    try {
      const currentDate = new Date().toISOString();
      await AsyncStorage.setItem("@lastActivity", currentDate);
    } catch (error) {
      console.error('Error actualizando última actividad:', error);
    }
  };

  // Función para establecer resultado de autenticación
  const setAuthResult = (result) => {
    dispatch({ type: AUTH_TYPES.SET_AUTH_RESULT, payload: result });
  };

  // Función para limpiar la autenticación
  const clearAuth = async () => {
    try {
      await AsyncStorage.removeItem("@msalToken");
      await AsyncStorage.removeItem("@lastActivity");
      await clearUserOid();
      dispatch({ type: AUTH_TYPES.CLEAR_AUTH });
    } catch (error) {
      console.error('Error al limpiar autenticación:', error);
    }
  };

  // Función para logout completo con MSAL
  const performLogout = async () => {
    try {
      // Intentar hacer signOut de MSAL si el cliente está disponible
      if (b2cClientRef.current) {
        await b2cClientRef.current.signOut();
      }
      // Limpiar todos los datos locales
      await clearAuth();
    } catch (error) {
      console.error('Error durante el logout:', error);
      // Aún así limpiar los datos locales
      await clearAuth();
      throw error;
    }
  };

  // Función para establecer estado de loading
  const setLoading = (loading) => {
    dispatch({ type: AUTH_TYPES.SET_LOADING, payload: loading });
  };

  // Función para inicializar la autenticación
  const initializeAuth = async (b2cClient) => {
    try {
      setLoading(true);
      b2cClientRef.current = b2cClient; // Guardar referencia al cliente
      await b2cClient.init();
      
      // Verificar si hay una sesión activa
      const isLoggedIn = await b2cClient.isSignedIn();
      const savedToken = await AsyncStorage.getItem("@msalToken");
      const savedOid = await AsyncStorage.getItem("@userOid");
      
      // Solo mantener la sesión si todos los datos están presentes
      if (isLoggedIn && savedToken && savedOid) {
        // Si hay sesión activa y todos los datos están guardados, mantener la sesión
        setAuthResult({ accessToken: savedToken });
        // Actualizar la última actividad al inicializar
        await updateLastActivity();
      } else {
        // Si falta algún dato o no hay sesión activa, limpiar todo
        await b2cClient.signOut();
        await clearAuth();
      }
      
    } catch (error) {
      console.error('Error durante la inicialización:', error);
      // En caso de error, limpiar todo
      await clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const value = {
    ...state,
    setAuthResult,
    clearAuth,
    setLoading,
    initializeAuth,
    performAutoLogout,
    checkSessionValidity,
    updateLastActivity,
    performLogout, // Nueva función de logout completo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
