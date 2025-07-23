import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Alert } from "react-native";
import HomeScreen from "../Home/HomeScreen";
import Profile from "../Profile/ProfileScreen";
import Settings from "../Settings/SettingsScreen";
import { redPressed, redStrong } from "../../constants/color";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../../context/Auth/AuthContext";

const Drawer = createDrawerNavigator();

// Componente dummy para el logout
const LogoutScreen = () => null;

const Root = () => {
  const { signOutUser } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              // Usar la función de logout manual
              await signOutUser();
            } catch (error) {
              console.error("Error durante el logout:", error);
              Alert.alert("Error", "Hubo un problema al cerrar sesión");
            }
          }
        }
      ]
    );
  };
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
      screenListeners={{
        drawerItemPress: (e) => {
          // Interceptar el press del logout
          if (e.target?.includes('Logout')) {
            e.preventDefault();
            handleLogout();
          }
        }
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
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          title: "Cerrar Sesión",
          drawerIcon: ({ color }) => (
            <Icon name="logout" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default Root;
