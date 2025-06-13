import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { redLife } from "../../constants/color";

const Error = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
      }}
    >
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Error encontrado
      </Text>
      <Icon.Button
        name="mail-forward"
        backgroundColor={redLife}
        underlayColor="red"
        selectionColor="black"
        color={"white"}
        size={25}
        borderRadius={15}
        onPress={() => alert("hola")}
        style={{
          padding: 20,
          justifyContent: "center",
          marginHorizontal: 50,
        }}
      >
        Reportar error
      </Icon.Button>
    </View>
  );
};

export default Error;
