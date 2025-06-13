import React, { useState } from "react";
import { Switch, Text, TextInput, View } from "react-native";
import { grey, redLife, redPressed } from "../../constants/color";
import styles from "./style";

const Panic = ({ order, comment, setcomment }) => {
  return (
    <View style={styles.main}>
      <Text style={styles.textTitle}>{order.orderId}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.subTitle}>
            Ingrese un comentario para incluirlo en la notificación:
          </Text>
        </View>
      </View>
      <TextInput
        placeholder="Ingresa un comentario..."
        editable
        multiline
        numberOfLines={5}
        maxLength={150}
        onChangeText={(text) => setcomment(text)}
        value={comment}
        backgroundColor={"white"}
        borderColor={redPressed}
        cursorColor={redLife}
        autoFocus
        style={styles.textArea}
      />
    </View>
  );
};

export default Panic;
