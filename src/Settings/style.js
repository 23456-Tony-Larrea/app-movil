import { StyleSheet } from "react-native";
import { blueStrong, grey } from "../../constants/color";
import { subTitleSize, textSize } from "../../constants/text";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: grey,
    marginTop: 10,
  },
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  subTitle: {
    color: blueStrong,
    fontWeight: "bold",
    textAlign: "left",
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
    maxWidth: "60%",
  },
});

export default styles;
