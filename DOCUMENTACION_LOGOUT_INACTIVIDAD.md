# Sistema de Logout por Inactividad (3 días)

## Descripción General

El sistema de autenticación ahora implementa un **logout automático por inactividad** que cierra la sesión del usuario después de **3 días sin usar la aplicación**.

## Características Principales

### ✅ Logout por Inactividad de 3 Días
- La sesión se mantiene activa mientras el usuario use la app regularmente
- Después de 3 días sin abrir la aplicación, la sesión se cierra automáticamente
- Mucho más amigable que el logout inmediato al background

### ✅ Seguimiento de Actividad
- Se registra automáticamente la última actividad cuando:
  - El usuario hace login
  - La app vuelve al estado activo (foreground)
  - Se inicializa la aplicación

### ✅ Verificación Inteligente
- Solo verifica la inactividad cuando la app vuelve al foreground
- No consume recursos cuando la app está en background
- Limpieza automática de datos al expirar la sesión

## Implementación Técnica

### Almacenamiento de Última Actividad
```javascript
// Se guarda en AsyncStorage como timestamp
await AsyncStorage.setItem("@lastActivity", currentTime.toString());
```

### Verificación de Expiración
```javascript
const lastActivityTime = parseInt(lastActivity);
const currentTime = new Date().getTime();
const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 días

if (currentTime - lastActivityTime > threeDaysInMs) {
  await performAutoLogout(); // Cierra sesión
}
```

### Funciones Principales

#### `updateLastActivity()`
- Actualiza el timestamp de última actividad
- Se ejecuta automáticamente en eventos clave

#### `checkSessionValidity()`
- Verifica si han pasado 3 días desde la última actividad
- Ejecuta logout automático si es necesario
- Valida la presencia de tokens y datos de sesión

#### `performAutoLogout()`
- Limpia todos los datos de sesión
- Remueve tokens, OID de usuario y timestamp de actividad
- Actualiza el estado del contexto

## Flujo de Funcionamiento

### Escenario 1: Uso Regular
```
1. Usuario abre la app → updateLastActivity()
2. Usuario usa la app normalmente
3. App va al background → No hace nada
4. Al día siguiente: Usuario abre la app → updateLastActivity()
5. Sesión continúa activa ✅
```

### Escenario 2: Inactividad de 3+ Días
```
1. Usuario abre la app (Día 1) → updateLastActivity()
2. Usuario no usa la app por 4 días
3. Usuario abre la app (Día 5) → checkSessionValidity()
4. Sistema detecta > 3 días → performAutoLogout()
5. Usuario debe volver a hacer login 🔒
```

## Archivos Modificados

### `src/context/Auth/AuthContext.js`
- ✅ Nuevo sistema de seguimiento de actividad
- ✅ Verificación de inactividad de 3 días
- ✅ Eliminado logout inmediato al background
- ✅ Funciones `updateLastActivity()` y verificación mejorada

## Beneficios del Nuevo Sistema

### 🚀 Mejor Experiencia de Usuario
- Los usuarios pueden usar la app normalmente sin reautenticarse constantemente
- Solo se requiere login después de inactividad prolongada
- No hay interrupciones por cambios de app

### 🔒 Seguridad Mantenida
- Sesiones no permanecen activas indefinidamente
- Logout automático después de período razonable
- Protección contra acceso no autorizado en dispositivos perdidos

### ⚡ Mejor Performance
- No ejecuta lógica de logout en cada cambio de estado
- Verificación ligera solo al volver a la app
- Menos operaciones de AsyncStorage

## Testing del Sistema

### Prueba Manual Rápida (Desarrollo)
```javascript
// En DevTools, cambiar el período a 30 segundos para testing:
const threeDaysInMs = 30 * 1000; // 30 segundos en lugar de 3 días

// Flujo de prueba:
1. Abrir app y autenticarse
2. Cerrar app por 35 segundos
3. Volver a abrir → Debe pedir login
```

### Prueba de Producción
```
1. Autenticarse en la app
2. No usar la app por 3+ días reales
3. Abrir la app → Debe requerir nuevo login
```

### Verificación de AsyncStorage
```javascript
// Verificar timestamp de última actividad
AsyncStorage.getItem('@lastActivity').then(console.log);

// Verificar limpieza después del logout
AsyncStorage.getItem('@msalToken').then(console.log); // null
AsyncStorage.getItem('@lastActivity').then(console.log); // null
```

## Configuración Personalizable

### Cambiar Período de Inactividad
```javascript
// En checkSessionValidity(), modificar:
const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 días

// Para 7 días:
const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

// Para 1 día:
const oneDayInMs = 24 * 60 * 60 * 1000;
```

## Comparación: Antes vs Ahora

### ❌ Sistema Anterior
- Logout inmediato al ir al background
- Muy molesto para el usuario
- Reautenticación constante requerida
- Mala experiencia de usuario

### ✅ Sistema Actual
- Logout solo después de 3 días sin uso
- Experiencia de usuario natural
- Sesión persistente durante uso normal
- Equilibrio perfecto entre seguridad y usabilidad

## Logs y Debugging

### Mensajes de Console
```javascript
// Actividad actualizada
console.log('Última actividad actualizada');

// Sesión expirada
console.log('Sesión expirada por inactividad de 3+ días');

// Error en verificación
console.error('Error al verificar la validez de la sesión:', error);
```

### Datos en AsyncStorage
```
@lastActivity: "1704067200000" (timestamp)
@msalToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
@userOid: "12345678-1234-1234-1234-123456789012"
```

## Mantenimiento Futuro

### Posibles Mejoras
1. **Configuración dinámica**: Permitir configurar el período desde la app
2. **Notificaciones**: Avisar al usuario antes de que expire la sesión
3. **Métricas**: Recopilar datos sobre patrones de uso de la aplicación
4. **Graceful degradation**: Manejar casos edge de timezone/cambio de fecha

### Consideraciones de Seguridad
- El período de 3 días es apropiado para apps de entrega
- Dispositivos perdidos/robados se protegen automáticamente
- Tokens expiran siguiendo las mejores prácticas de seguridad

## Conclusión

El nuevo sistema de logout por inactividad de 3 días proporciona el equilibrio perfecto entre **seguridad** y **experiencia de usuario**, eliminando las molestias del logout inmediato mientras mantiene la protección necesaria para datos sensibles.

**🎯 Resultado**: Los usuarios pueden usar la app de manera natural sin interrupciones, pero la sesión se cierra automáticamente después de un período razonable de inactividad.
