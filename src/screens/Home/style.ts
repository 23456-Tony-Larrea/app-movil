import { StyleSheet } from "react-native";
import { blueStrong, grey, redStrong } from "../../constants/color";
import { subTitleSize, textSize, titleSize } from "../../constants/text";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: grey,
    // marginTop: StatusBar.currentHeight || 0,
    marginTop: 10,
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    padding: 10,
    color: redStrong,
    fontSize: titleSize,
    textAlign: "center",
    fontWeight: "bold",
  },
  subTitle: {
    color: blueStrong,
    fontWeight: "bold",
    fontSize: subTitleSize,
  },
  text: {
    color: blueStrong,
    fontSize: textSize,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  column: {
    flexDirection: "column",
    flexWrap: "wrap",
    width: "50%",
  },
  box: {
    textAlign: "center",
    fontWeight: "bold",
    padding: 8,
  },
});

export default styles;
