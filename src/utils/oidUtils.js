import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Obtiene el OID del usuario logueado
 * @returns {Promise<string|null>} OID del usuario o null si no existe
 */
export const getUserOid = async () => {
  try {
    return await AsyncStorage.getItem("@userOid");
  } catch (error) {
    return null;
  }
};

/**
 * Limpia el OID del usuario del almacenamiento
 * @returns {Promise<boolean>} true si se limpió correctamente
 */
export const clearUserOid = async () => {
  try {
    await AsyncStorage.removeItem("@userOid");
    return true;
  } catch (error) {
    console.error("Error clearing user OID:", error);
    return false;
  }
};

/**
 * Verifica si hay un OID guardado
 * @returns {Promise<boolean>} true si hay un OID guardado
 */
export const hasUserOid = async () => {
  try {
    const oid = await AsyncStorage.getItem("@userOid");
    return !!oid;
  } catch (error) {
    console.error("Error checking user OID:", error);
    return false;
  }
};
