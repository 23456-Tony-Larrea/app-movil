import React from "react";
import styles from "./style";
import { View } from "react-native";
// import { useWindowDimensions } from "react-native";
import Company from "../../components/Settings/Company";

const Settings = () => {
  // const dimensions = useWindowDimensions();

  return (
    <View style={styles.main}>
      <View
        style={[
          styles.container,
          // {
          //   minHeight: dimensions.height - (dimensions.height * 12) / 100,
          // },
        ]}
      >
        <Company />
      </View>
    </View>
  );
};

export default Settings;
