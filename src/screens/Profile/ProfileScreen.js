import { View, Text } from "react-native";
import React from "react";
import { grey } from "../../constants/color";
import globalStyles from "../../global/style";

const Profile = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: grey,
        marginTop: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          borderRadius: 15,
          marginVertical: 8,
          marginHorizontal: 16,
        }}
      >
        <Text style={globalStyles.title}>Hola, Patricio</Text>
      </View>
    </View>
  );
};

export default Profile;
