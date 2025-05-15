import { StyleSheet } from "react-native";
import { blueStrong } from "../constants/color";
import { titleSize } from "../constants/text";

const globalStyles = StyleSheet.create({
  item: {
    borderRadius: 15,
    marginHorizontal: 16,
  },
  title: {
    padding: 2,
    color: blueStrong,
    fontSize: titleSize,
    textAlign: "center",
    fontWeight: "bold",
  },
  itemSeparator: {
    height: 10,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0)",
  },
  modalMain: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalBox: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    width: "75%",
    height: "30%",
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.75)',
    // shadowColor: "white",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.75,
    elevation: 20,
  },
  modalBtnExit: {
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 100,
  },
  modalMainView: {
    fontWeight: "bold",
    paddingHorizontal: 25,
    paddingVertical: 15,
    zIndex: 1,
    marginTop: 30,
  },
  modalAccionBtn: {
    paddingTop: 10,
    margin: 10,
  },
});

export default globalStyles;
