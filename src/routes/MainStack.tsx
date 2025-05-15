import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";
import { blueStrong } from "../constants/color";
import Login from "../login/Login"; // Importa el componente Login
import Root from "../screens/Root/RootScreen";
import OrderLines from "../screens/OrderLines/OrderLinesScreen";
import DeliverOrderScreen from "../screens/DeliveryOrder/DeliveryOrderScreen";
import NotificationScreen from "../screens/Notification/NotificationScreen";
import DocumentsScreen from "../screens/DocumentScreen/DocumentScreen";
import Camera from "../components/Camera/Camera";


const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: blueStrong,
        headerStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="Root"
        component={Root}
        options={{
          title: "Órdenes de transporte",
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="Detalles"
        component={(props: any) => <OrderLines {...props} />}
        options={{headerBackVisible: false,}}
      />
      <Stack.Screen
        name="EntregarOrden"
        component={(props: any) => <DeliverOrderScreen {...props} />}
        options={{title: "Entregar orden",}}
      />
      <Stack.Screen
        name="PanicNotification"
        component={(props: any) => <NotificationScreen {...props} />}
        options={{title: "Notificación de pánico",}}
      />
      <Stack.Screen
        name="DocumentsScreen"
        component={(props: any) => <DocumentsScreen {...props} />}
        options={{title: "Documento cargado",}}
      />
      <Stack.Screen
        name="Camera"
        component={(props: any) => <Camera {...props} />}
        options={{title: "Carga de archivos",}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: blueStrong,
  },
});

export default MainStack;