import { View, Text } from "react-native";
import React from "react";
import { grey, redStrong, redLife } from "../../constants/color";
import globalStyles from "../../global/style";
import Icon from "react-native-vector-icons/MaterialIcons";

const Profile = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: redLife,
          padding: 24,
          borderRadius: 20,
          alignItems: "center",
          shadowColor: redStrong,
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Icon
          name="account-circle"
          size={64}
          color={redStrong}
          style={{ marginBottom: 12 }}
        />
        <Text
          style={[
            globalStyles.title,
            {
              color: "#fff",
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 8,
            },
          ]}
        >
          Hola, Patricio
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          ¡Bienvenido a tu perfil!
        </Text>
      </View>
    </View>
  );
};

export default Profile;
