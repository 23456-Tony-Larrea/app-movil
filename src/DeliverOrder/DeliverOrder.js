import React, { useState } from "react";
import { Switch, Text, TextInput, View } from "react-native";
import { grey, redLife, redPressed } from "../../constants/color";
import styles from "./style";

const DeliverOrder = ({
  order,
  isEnabled,
  setIsEnabled,
  comment,
  setcomment,
}) => {
  const toggleSwitch = () => {
    setcomment("");
    setIsEnabled((previousState) => !previousState);
  };

  return (
    <View style={styles.main}>
      <Text style={styles.textTitle}>{order.orderId}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Marcar incumplimiento</Text>
        </View>
        <View style={styles.column}>
          <Switch
            trackColor={{ false: "grey", true: redLife }}
            thumbColor={isEnabled ? redLife : grey}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <TextInput
        placeholder="Detalles de incumplimiento..."
        editable={isEnabled}
        multiline
        numberOfLines={5}
        maxLength={150}
        onChangeText={(text) => setcomment(text)}
        value={comment}
        backgroundColor={isEnabled ? "white" : grey}
        borderColor={isEnabled ? redPressed : "white"}
        cursorColor={redLife}
        style={styles.textArea}
      />
    </View>
  );
};

export default DeliverOrder;
