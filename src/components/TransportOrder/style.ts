import { StyleSheet } from "react-native";
import { subTitleSize, textSize, titleSize } from "../../constants/text";
import { blueStrong, grey } from "../../constants/color";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: grey,
    // marginTop: StatusBar.currentHeight || 0,
    marginTop: 10,
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
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
  subTitle: {
    color: blueStrong,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: subTitleSize,
  },
  text: {
    color: blueStrong,
    fontSize: textSize,
  },
  row: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
  },
  column: {
    textAlign: "center",
    fontWeight: "bold",
    padding: 8,
  },
  modalContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
},
modalContent: {
  width: "80%",
  backgroundColor: "white",
  padding: 20,
  borderRadius: 10,
  alignItems: "center",
},
modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 20,
},
modalOption: {
  fontSize: 16,
  marginVertical: 10,
  color: "blue",
},
searchInput: {
  height: 40,
  borderColor: "gray",
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 10,
  marginBottom: 10,
},
selectedDate: {
  marginVertical: 10,
  fontSize: 16,
  color: "gray",
},
});

export default styles;
