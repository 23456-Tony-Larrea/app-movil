import { StyleSheet } from "react-native";
import { titleSize } from "../../constants/text";
import { blueStrong } from "../../constants/color";

const styles = StyleSheet.create({
  main: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    padding: 5,
    // justifyContent: "space-between",
  },
  column: {
    textAlign: "center" as "center", // Explicitly typed to avoid issues
    fontWeight: "bold",
    // padding: 8,
    marginRight: 15,
    justifyContent: "center",
  },
  textTitle: {
    fontWeight: "bold",
    color: blueStrong,
    paddingBottom: 10,
    textAlign: "center" as "center", // Explicitly typed
    fontSize: titleSize,
  },
  subTitle: {
    fontWeight: "bold",
    color: blueStrong,
    paddingBottom: 10,
    fontSize: 15,
  },
  textArea: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
  },
});

export default styles;