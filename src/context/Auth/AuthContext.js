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

  // Efecto para manejar el ciclo de vida de la aplicación
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  // Función para manejar cambios en el estado de la aplicación
  const handleAppStateChange = async (nextAppState) => {
    // Si la app va de activa a background o inactive, hacer logout automático
    if (
      appState.current.match(/active/) && 
      nextAppState.match(/background|inactive/)
    ) {
      await performAutoLogout();
    }
    
    // Si la app vuelve a estar activa desde el background, verificar la sesión
    if (
      appState.current.match(/background|inactive/) && 
      nextAppState === 'active'
    ) {
      await checkSessionValidity();
    }
    
    appState.current = nextAppState;
  };

  // Función para realizar logout automático
  const performAutoLogout = async () => {
    try {
      // Limpiar todos los datos de sesión
      await AsyncStorage.removeItem("@msalToken");
      await clearUserOid();
      
      // Actualizar el estado
      dispatch({ type: AUTH_TYPES.CLEAR_AUTH });
      
    } catch (error) {
      console.error('Error durante el logout automático:', error);
    }
  };

  // Función para verificar la validez de la sesión
  const checkSessionValidity = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("@msalToken");
      const savedOid = await AsyncStorage.getItem("@userOid");
      
      if (!savedToken || !savedOid) {
        // Si los datos fueron limpiados, cerrar sesión
        dispatch({ type: AUTH_TYPES.CLEAR_AUTH });
      }
    } catch (error) {
      console.error('Error al verificar la validez de la sesión:', error);
      dispatch({ type: AUTH_TYPES.CLEAR_AUTH });
    }
  };

  // Función para establecer resultado de autenticación
  const setAuthResult = (authResult) => {
    dispatch({ type: AUTH_TYPES.SET_AUTH_RESULT, payload: authResult });
  };

  // Función para limpiar autenticación
  const clearAuth = async () => {
    try {
      await AsyncStorage.removeItem("@msalToken");
      await clearUserOid();
      dispatch({ type: AUTH_TYPES.CLEAR_AUTH });
    } catch (error) {
      console.error('Error al limpiar autenticación:', error);
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
      await b2cClient.init();
      
      // Verificar si hay una sesión activa
      const isLoggedIn = await b2cClient.isSignedIn();
      const savedToken = await AsyncStorage.getItem("@msalToken");
      const savedOid = await AsyncStorage.getItem("@userOid");
      
      // Solo mantener la sesión si todos los datos están presentes
      if (isLoggedIn && savedToken && savedOid) {
        // Si hay sesión activa y todos los datos están guardados, mantener la sesión
        setAuthResult({ accessToken: savedToken });
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

export default AuthContext;
