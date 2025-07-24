import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Utilidades para manejar la información del usuario logueado
 */

/**
 * Obtiene toda la información del usuario guardada
 * @returns {Promise<Object>} Objeto con toda la información del usuario
 */
export const getUserInfo = async () => {
  try {
    const [
      userId,
      userName,
      userEmail,
      userGivenName,
      userFamilyName,
      userSubjectId,
      userObjectId,
      userClaims,
      accessToken,
      idToken
    ] = await Promise.all([
      AsyncStorage.getItem("@userId"),
      AsyncStorage.getItem("@userName"),
      AsyncStorage.getItem("@userEmail"),
      AsyncStorage.getItem("@userGivenName"),
      AsyncStorage.getItem("@userFamilyName"),
      AsyncStorage.getItem("@userSubjectId"),
      AsyncStorage.getItem("@userObjectId"),
      AsyncStorage.getItem("@userClaims"),
      AsyncStorage.getItem("@msalToken"),
      AsyncStorage.getItem("@idToken")
    ]);

    return {
      userId,
      userName,
      userEmail,
      userGivenName,
      userFamilyName,
      userSubjectId,
      userObjectId,
      userClaims: userClaims ? JSON.parse(userClaims) : null,
      accessToken,
      idToken
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

/**
 * Obtiene solo el ID del usuario (identifier)
 * @returns {Promise<string|null>} ID del usuario o null si no existe
 */
export const getUserId = async () => {
  try {
    return await AsyncStorage.getItem("@userId");
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

/**
 * Obtiene el Subject ID del usuario (del token JWT)
 * @returns {Promise<string|null>} Subject ID del usuario o null si no existe
 */
export const getUserSubjectId = async () => {
  try {
    return await AsyncStorage.getItem("@userSubjectId");
  } catch (error) {
    console.error("Error getting user subject ID:", error);
    return null;
  }
};

/**
 * Obtiene el Object ID del usuario (del token JWT)
 * @returns {Promise<string|null>} Object ID del usuario o null si no existe
 */
export const getUserObjectId = async () => {
  try {
    return await AsyncStorage.getItem("@userObjectId");
  } catch (error) {
    console.error("Error getting user object ID:", error);
    return null;
  }
};

/**
 * Obtiene el email del usuario
 * @returns {Promise<string|null>} Email del usuario o null si no existe
 */
export const getUserEmail = async () => {
  try {
    return await AsyncStorage.getItem("@userEmail");
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
};

/**
 * Obtiene el nombre completo del usuario
 * @returns {Promise<string>} Nombre completo del usuario
 */
export const getUserFullName = async () => {
  try {
    const [givenName, familyName] = await Promise.all([
      AsyncStorage.getItem("@userGivenName"),
      AsyncStorage.getItem("@userFamilyName")
    ]);
    
    if (givenName && familyName) {
      return `${givenName} ${familyName}`;
    } else if (givenName) {
      return givenName;
    } else if (familyName) {
      return familyName;
    } else {
      const userName = await AsyncStorage.getItem("@userName");
      return userName || "Usuario";
    }
  } catch (error) {
    console.error("Error getting user full name:", error);
    return "Usuario";
  }
};

/**
 * Limpia toda la información del usuario del almacenamiento
 * @returns {Promise<boolean>} true si se limpió correctamente
 */
export const clearUserInfo = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem("@userId"),
      AsyncStorage.removeItem("@userName"),
      AsyncStorage.removeItem("@userEmail"),
      AsyncStorage.removeItem("@userGivenName"),
      AsyncStorage.removeItem("@userFamilyName"),
      AsyncStorage.removeItem("@userSubjectId"),
      AsyncStorage.removeItem("@userObjectId"),
      AsyncStorage.removeItem("@userClaims"),
      AsyncStorage.removeItem("@msalToken"),
      AsyncStorage.removeItem("@idToken")
    ]);
    return true;
  } catch (error) {
    console.error("Error clearing user info:", error);
    return false;
  }
};

/**
 * Verifica si hay un usuario logueado
 * @returns {Promise<boolean>} true si hay un usuario logueado
 */
export const isUserLoggedIn = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("@msalToken");
    return !!accessToken;
  } catch (error) {
    console.error("Error checking if user is logged in:", error);
    return false;
  }
};
