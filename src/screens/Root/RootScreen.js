import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../Home/HomeScreen";
import Profile from "../Profile/ProfileScreen";
import Settings from "../Settings/SettingsScreen";
import { redPressed, redStrong } from "../../constants/color";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

const Drawer = createDrawerNavigator();

const Root = () => {
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

export default Root;
