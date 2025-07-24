import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainStack from "./src/routes/MainStack";
import TransportOrderState from "./src/context/TransportOrder/TransportOrderState";
import OrderLineState from "./src/context/TransportOrderLines/OrderLineState";
import Login from "./src/login/login";
import { AuthProvider } from "./src/context/Auth/AuthContext";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthProvider>
        <TransportOrderState>
          <OrderLineState>
            {/* <MainStack /> */}
            <Login />
          </OrderLineState>
        </TransportOrderState>
      </AuthProvider>
    </SafeAreaView>
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
