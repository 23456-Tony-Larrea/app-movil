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
});

export default styles;
