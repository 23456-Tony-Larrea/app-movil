import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import React from "react";
import { grey } from "../../constants/color";
import globalStyles from "../../global/style";

const Profile: React.FC = () => {
  const containerStyle: StyleProp<ViewStyle> = {
    flex: 1,
    backgroundColor: grey,
    marginTop: 10,
  };

  const cardStyle: StyleProp<ViewStyle> = {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 16,
  };

  const titleStyle: StyleProp<TextStyle> = globalStyles.title;

  return (
    <View style={containerStyle}>
      <View style={cardStyle}>
        <Text style={titleStyle}>Hola, Patricio</Text>
      </View>
    </View>
  );
};

export default Profile;