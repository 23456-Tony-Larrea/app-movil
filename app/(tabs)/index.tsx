import "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MainStack from "@/src/routes/MainStack";
import OrderLineState from "@/src/context/TransportOrderLines/OrderLineState";
import TransportOrderState from "@/src/context/TransportOrder/TransportOrderState";

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
       <TransportOrderState>
       <OrderLineState>
      <MainStack />
      </OrderLineState>
      </TransportOrderState>
    </SafeAreaView>
  );
};

export default App;