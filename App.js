import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainStack from "./src/routes/MainStack";
import TransportOrderState from "./src/context/TransportOrder/TransportOrderState";
import OrderLineState from "./src/context/TransportOrderLines/OrderLineState";
import Login from "./src/login/login";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <TransportOrderState>
        <OrderLineState>
          <SafeAreaView style={{ flex: 1 }}>
            {/* <MainStack /> */}
            <Login />
          </SafeAreaView>
        </OrderLineState>
      </TransportOrderState>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
