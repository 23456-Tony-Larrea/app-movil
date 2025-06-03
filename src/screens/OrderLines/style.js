import { StyleSheet } from "react-native";
import { subTitleSize, textSize, titleSize } from "../../constants/text";
import { blueStrong, grey } from "../../constants/color";
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: grey,
    marginTop: 10,
    // flexDirection: "column",
  },
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    marginVertical: 3,
    marginHorizontal: 16,
  },
  viewDoc: {
    height: 80,
    justifyContent: "center",
    borderRadius: 15,
  },
  btnDeliverOrder: {
    paddingHorizontal: 10,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: "2%",
    width: "100%",
    height: "7%",
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
});

export default styles;
