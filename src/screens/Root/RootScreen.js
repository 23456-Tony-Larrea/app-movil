import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../Home/HomeScreen";
import Profile from "../Profile/ProfileScreen";
import Settings from "../Settings/SettingsScreen";
import { redPressed, redStrong } from "../../constants/color";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { B2CClient } from "../../login/b2cClient";
import { b2cConfig } from "../../login/msalConfig";

const Drawer = createDrawerNavigator();

const b2cClient = new B2CClient(b2cConfig);

const Root = () => {
  // Cierra sesión y elimina el token cada vez que se monta Root
  useEffect(() => {
    (async () => {
      try {
        await b2cClient.init();
        await b2cClient.signOut(); // Esto elimina el token MSAL
      } catch (error) {
        // Ignorar errores
      }
    })();
  }, []);

  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{
        drawerStyle: {
          backgroundColor: "white",
          width: "62%",
        },
        drawerItemStyle: {
          borderBottomWidth: 1,
          borderBottomColor: redPressed,
        },
        drawerActiveTintColor: redStrong,
        drawerType: "slide",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Órdenes de transporte",
          drawerIcon: ({ color }) => (
            <Icon2
              name="file-document-multiple-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Cuenta"
        component={Profile}
        options={{
          title: "Mi Cuenta",
          drawerIcon: ({ color }) => (
            <Icon2 name="account" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Configurar"
        component={Settings}
        options={{
          title: "Configurar",
          drawerIcon: ({ color }) => (
            <Icon name="settings" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  logoutText: {
    marginLeft: 4,
    color: redStrong,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Root;
