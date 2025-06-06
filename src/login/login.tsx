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

import { B2CClient } from "./b2cClient";
import { b2cConfig, b2cScopes as scopes } from "./msalConfig";
import MainStack from "../routes/MainStack";
import Loading from "../components/Loading/Loading";
import { redLife } from "../constants/color";
import { subTitleSize } from "../constants/text";

const b2cClient = new B2CClient(b2cConfig);

export default function Login() {
  const [loadingLocal, setloadingLocal] = React.useState<boolean>(false);
  const [authResult, setAuthResult] = React.useState<MSALResult | null>(null);
  const [iosEphemeralSession, setIosEphemeralSession] = React.useState(false);
  const webviewParameters: MSALWebviewParams = {
    ios_prefersEphemeralWebBrowserSession: iosEphemeralSession,
  };

  React.useEffect(() => {
    async function init() {
      try {
        await b2cClient.init();
        await b2cClient.signOut(); // Cierra sesión cada vez que se refresca la app
        setAuthResult(null);
      } catch (error) {
        console.error(error);
      }
    }
    init();
  }, []);

  const handleSignInPress = async () => {
    setloadingLocal(true);
    try {
      const res = await b2cClient.signIn({ scopes, webviewParameters });
      setAuthResult(res);
      if (res && res.accessToken) {
        console.log('MSAL Access Token:', res.accessToken);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setloadingLocal(false);
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
      console.warn(error);
    }
  };

  const handleSignoutPress = async () => {
    try {
      await b2cClient.signOut();
      setAuthResult(null);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <>
      {loadingLocal && (
        <Loading loading={loadingLocal} opacity={0.15} sizeIcon={40} />
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