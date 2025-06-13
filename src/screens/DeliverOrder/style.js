import { StyleSheet } from "react-native";
import { grey } from "../../constants/color";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: grey,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    padding: 5,
    // justifyContent: "space-between",
  },
  column: {
    textAlign: "center",
    fontWeight: "bold",
    // padding: 8,
    marginRight: 15,
    justifyContent: "center",
  },
  btnDeliverOrder: {
    paddingHorizontal: 10,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: "2%",
    width: "100%",
    height: "7%",
  },
});

export default styles;
