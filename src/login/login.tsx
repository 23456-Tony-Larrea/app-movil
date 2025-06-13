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
        const isSignedIn = await b2cClient.isSignedIn();
        if (isSignedIn) {
          setAuthResult(await b2cClient.acquireTokenSilent({ scopes }));
        }
      } catch (error) {
        console.error(error);
      }
    }
    init();
  }, []);

  const handleSignInPress = async () => {
    try {
      const res = await b2cClient.signIn({ scopes, webviewParameters });
      setAuthResult(res);
    } catch (error) {
      console.warn(error);
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
                width: "60%",
                height: "70%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={require("../../assets/Life83.gif")} />
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
