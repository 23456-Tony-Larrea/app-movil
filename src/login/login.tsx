/**
 * Example for a Azure B2C application using a B2CClient helper class
 */

import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import type { MSALResult, MSALWebviewParams } from "react-native-msal";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { B2CClient } from "./b2cClient";
import { b2cConfig, b2cScopes as scopes } from "./msalConfig";
import MainStack from "../routes/MainStack";
import Loading from "../components/Loading/Loading";
import { redLife } from "../constants/color";
import { subTitleSize } from "../constants/text";
import { useAuth } from "../context/Auth/AuthContext";

const b2cClient = new B2CClient(b2cConfig);

export default function Login() {
  const { 
    authResult, 
    isLoading, 
    isInitialized,
    setAuthResult, 
    clearAuth, 
    setLoading, 
    initializeAuth 
  } = useAuth();
  
  const [iosEphemeralSession, setIosEphemeralSession] = React.useState(false);
  
  const webviewParameters: MSALWebviewParams = {
    ios_prefersEphemeralWebBrowserSession: iosEphemeralSession,
  };

  React.useEffect(() => {
    // Inicializar la autenticación usando el contexto
    initializeAuth(b2cClient);
  }, []);

  const handleSignInPress = async () => {
    setLoading(true);
    try {
      const res = await b2cClient.signIn({ scopes, webviewParameters });
      
      if (res && res.accessToken) {
        // Guardar el token de acceso
        await AsyncStorage.setItem("@msalToken", res.accessToken);
        
        // Extraer solo el OID del usuario
        if (res.account && res.account.claims) {
          const claims = res.account.claims as any;
          if (claims.oid) {
            const userOid = claims.oid;
            await AsyncStorage.setItem("@userOid", userOid);
          }
        }
        
        // Actualizar el estado de autenticación
        setAuthResult(res);
      }
    } catch (error) {
      console.warn('Error durante el login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcquireTokenPress = async () => {
    try {
      const res = await b2cClient.acquireTokenSilent({
        scopes,
        forceRefresh: true,
      });
      setAuthResult(res);
    } catch (error) {
      console.warn('Error al adquirir token:', error);
    }
  };

  const handleSignoutPress = async () => {
    try {
      await b2cClient.signOut();
      await clearAuth(); // Usar la función del contexto
    } catch (error) {
      console.warn('Error durante el logout:', error);
    }
  };

  return (
    <>
      {isLoading && (
        <Loading loading={isLoading} opacity={0.15} sizeIcon={40} />
      )}
      {/* {!true ? ( */}
      {authResult ? (
         <MainStack />
         ) : (
        <>
          <View style={styles.container}>
            <View
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: "#fff", // avatar fondo blanco
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
                shadowColor: redLife,
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: 2,
                borderColor: "#fff"
              }}
            >
              <Image
                source={require("../../assets/LIFE.png")}
                style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: "#fff" }}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity
              style={[styles.btnDeliverOrder]}
              onPress={() => handleSignInPress()}
            >
              <Text style={{ color: "white", fontSize: subTitleSize + 1 }}>
                Ingresar
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* <ScrollView style={styles.scrollView}>
        <Text>{JSON.stringify(authResult, null, 2)}</Text>
      </ScrollView> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDeliverOrder: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: redLife,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "7%",
  },
});