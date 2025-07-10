# Resumen de Cambios: Implementación de Bearer Token y Debugging

## 📋 Cambios Realizados

### 1. **TransportOrderState.js**
- ✅ Agregada función `getMSALToken()` para obtener el token desde AsyncStorage
- ✅ Agregada función `createAuthHeaders()` para crear headers con Bearer token
- ✅ Actualizada función `getTransportOrders()` con:
  - Headers de autorización
  - Logs detallados para debugging
  - Manejo de errores mejorado
- ✅ Actualizada función `postTransportOrderChecker()` con:
  - Headers de autorización
  - Logs detallados para debugging
- ✅ Actualizada función `postCheckDelivered()` con:
  - Headers de autorización
  - Logs detallados para debugging

### 2. **OrderLineState.js**
- ✅ Agregada función `getMSALToken()` para obtener el token desde AsyncStorage
- ✅ Agregada función `createAuthHeaders()` para crear headers con Bearer token
- ✅ Actualizadas TODAS las funciones con fetch():
  - `getOrderLine()` - GET con headers de autorización
  - `getDocumentation()` - GET con headers de autorización
  - `getBase64Doc()` - POST con headers de autorización
  - `postSPDocumentation()` - POST con headers de autorización
  - `postNewSPDocumentation()` - POST con headers de autorización
  - `postAXDocumentation()` - POST con headers de autorización (2 llamadas)
  - `postAXUpdateDocumentation()` - POST con headers de autorización
  - `postPanicNotification()` - POST con headers de autorización
  - `deleteSPDocumentation()` - POST con headers de autorización
- ✅ Agregados logs detallados con prefijo `[OrderLine]` para distinguir

### 3. **Utilidad de Debugging (tokenDebugger.js)**
- ✅ Creado archivo `src/utils/tokenDebugger.js` con:
  - `TokenDebugger.checkToken()` - Verifica el token y muestra detalles
  - `TokenDebugger.clearToken()` - Limpia el token (útil para testing)
  - `TokenDebugger.setMockToken()` - Establece token simulado para testing
  - `TokenDebugger.checkAllStorageKeys()` - Muestra todas las claves de AsyncStorage
  - `debugToken()` - Función global para debugging rápido
  - `debugAuthHeader()` - Verifica el header de autorización

### 4. **HomeScreen.js**
- ✅ Agregado import del debugger de tokens
- ✅ Agregado debugging automático del token en useEffect
- ✅ Agregada función `handleDebugToken()` para debugging manual
- ✅ Agregado botón "🔍 DEBUG TOKEN" en la interfaz para testing

## 🔍 Cómo Usar el Debugging

### 1. **Logs Automáticos**
Los logs aparecerán automáticamente en la consola cuando:
- Se haga login (token se guarda)
- Se cargue HomeScreen (se verifica el token)
- Se hagan llamadas a la API (se agrega Bearer token)

### 2. **Debugging Manual**
- Presiona el botón "🔍 DEBUG TOKEN" en HomeScreen para verificar el token
- Usa `debugToken()` desde cualquier componente

### 3. **Logs en Consola**
Busca estos emojis en la consola:
- 🔑 - Token obtenido/verificado
- 🔐 - Header Authorization agregado
- 🚀 - Inicio de función
- 📊 - Parámetros de entrada
- 🌐 - URL de la API
- 📋 - Headers enviados
- 📥 - Respuesta recibida
- ✅ - Éxito
- ❌ - Error
- ⚠️ - Advertencia

## 🛠️ Para Depurar en Móvil

### 1. **React Native Debugger**
```bash
npx react-native log-android  # Para Android
npx react-native log-ios      # Para iOS
```

### 2. **Metro Bundler**
Los logs aparecerán en la terminal donde ejecutaste `npm start` o `expo start`

### 3. **Flipper (Recomendado)**
- Instala Flipper
- Conecta tu dispositivo/emulador
- Ve a la pestaña "Logs" para ver todos los console.log

## 🔧 Solución de Problemas

### Si no ves el token:
1. Verifica que el login se complete correctamente
2. Revisa que se guarde en AsyncStorage con la clave "@msalToken"
3. Usa el botón "🔍 DEBUG TOKEN" para verificar

### Si las APIs fallan:
1. Verifica que el token se esté enviando en los headers
2. Revisa los logs con 🔐 para confirmar que se agrega Authorization
3. Verifica que el servidor acepte el token

### Si el token expira:
1. Implementa renovación automática del token
2. Maneja errores 401 para solicitar re-login
3. Verifica la fecha de expiración en los logs del debugger

## 📱 Ejemplo de Uso

```javascript
// En cualquier componente
import { TokenDebugger } from '../utils/tokenDebugger';

// Verificar token
await TokenDebugger.checkToken();

// Limpiar token para testing
await TokenDebugger.clearToken();

// Ver todas las claves almacenadas
await TokenDebugger.checkAllStorageKeys();
```

## 🚀 Próximos Pasos

1. Testa el login y verifica los logs
2. Prueba las llamadas a la API y confirma que se envía el Bearer token
3. Implementa manejo de errores 401 para token expirado
4. Considera agregar refresh token automático
