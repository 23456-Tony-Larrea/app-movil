import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
/* import HomeScreen from "../Home/HomeScreen";
 */import Profile from "../Profile/ProfileScreen";
import Settings from "../Settings/SettingsScreen";
import { redPressed, redStrong } from "../../constants/color";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../Home/HomeScreen";

const Drawer = createDrawerNavigator();

const Root: React.FC = () => {
  return (
    <Drawer.Navigator
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
          drawerIcon: ({ color }: { color: string }) => (
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
          drawerIcon: ({ color }: { color: string }) => (
            <Icon2 name="account" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Configurar"
        component={Settings}
        options={{
          title: "Configurar",
          drawerIcon: ({ color }: { color: string }) => (
            <Icon name="settings" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default Root;