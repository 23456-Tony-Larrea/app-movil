import { StyleSheet } from "react-native";
import { grey, redLife } from "../../constants/color";

const styles = StyleSheet.create({
  btnFilterOrder: {
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 60,
    height: 60,
    backgroundColor: redLife,
    borderRadius: 100,
  },
  btnDeliverOrder: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: redLife,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  btnUpload: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: grey,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
  },
});

export default styles;
