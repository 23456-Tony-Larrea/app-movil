/**
 * Example for a Azure B2C application using a B2CClient helper class
 */

import React from "react";
import MainStack from "../routes/MainStack";
import Loading from "../components/Loading/Loading";
import { B2CClient } from "./b2cClient";
import { b2cConfig, b2cScopes as scopes } from "./msalConfig";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { redLife } from "../constants/color";
import { subTitleSize } from "../constants/text";

const b2cClient = new B2CClient(b2cConfig);

export default function Login() {
  const [loadingLocal, setloadingLocal] = React.useState(false);
  const [authResult, setAuthResult] = React.useState(null);
  const [iosEphemeralSession, setIosEphemeralSession] = React.useState(false);
  const webviewParameters = {
    ios_prefersEphemeralWebBrowserSession: iosEphemeralSession,
  };

  React.useEffect(() => {
    async function init() {
      try {
        await b2cClient.init();
        await b2cClient.signOut(); // Cierra sesión y elimina el token cada vez que se refresca la app
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

  if (loadingLocal) {
    return <Loading loading={loadingLocal} opacity={0.15} sizeIcon={40} />;
  }

  return (
    <NavigationContainer>
      {authResult ? (
        <MainStack />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: "#fff",
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
              source={require("../../assets/LIFE-APP.png")}
              style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: "#fff" }}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            style={[styles.btnDeliverOrder]}
            onPress={handleSignInPress}
          >
            <Text style={{ color: "white", fontSize: subTitleSize + 1 }}>
              Ingresar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </NavigationContainer>
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
