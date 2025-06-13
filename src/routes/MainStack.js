import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { blueStrong } from "../constants/color";
import Root from "../screens/Root/RootScreen";
import OrderLines from "../screens/OrderLines/OrderLinesScreen";
import DeliverOrderScreen from "../screens/DeliverOrder/DeliverOrderScreen";
import NotificationScreen from "../screens/Notification/NotificationScreen";
import DocumentsScreen from "../screens/DocumentsScreen/DocumentScreen";
import Camera from "../components/Camera/Camera";

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: blueStrong,
          headerStyle: { backgroundColor: "white" },
        }}
      >
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
          component={OrderLines}
          options={{
            // title: "",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="EntregarOrden"
          component={DeliverOrderScreen}
          options={{
            title: "Entregar orden",
          }}
        />
        <Stack.Screen
          name="PanicNotification"
          component={NotificationScreen}
          options={{
            title: "Notificación de pánico",
          }}
        />
        <Stack.Screen
          name="DocumentsScreen"
          component={DocumentsScreen}
          options={{
            title: "Documento cargado",
          }}
        />
        <Stack.Screen
          name="Camera"
          component={Camera}
          options={{
            title: "Carga de archivos",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
