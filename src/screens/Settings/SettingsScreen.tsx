import React from "react";
import styles from "./style";
import { View, StyleProp, ViewStyle } from "react-native";
// import { useWindowDimensions } from "react-native";
import Company from "../../components/Settings/Company";

const Settings: React.FC = () => {
  // const dimensions = useWindowDimensions();

  const mainStyle: StyleProp<ViewStyle> = styles.main;
  const containerStyle: StyleProp<ViewStyle> = styles.container;

  return (
    <View style={mainStyle}>
      <View
        style={[
          containerStyle,
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