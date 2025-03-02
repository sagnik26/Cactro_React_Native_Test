import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

const Introduction = () => {
  return (
    <View style={styles.main}>
      <Text
        style={[
          styles.textStyle,
          {
            fontSize: 28,
            fontFamily: "Outfit-Bold",
            transform: [{ rotate: "-2deg" }],
          },
        ]}
      >
        GlowUp ✨
      </Text>
      <Text
        style={[
          styles.textStyle,
          {
            marginTop: 10,
            fontSize: 18,
            fontFamily: "Outfit-Medium",
            transform: [{ rotate: "1deg" }],
          },
        ]}
      >
        😃 Flash that smile & let the filter do the rest!
      </Text>
      <Text
        style={[
          styles.textStyle,
          {
            marginTop: 20,
            fontSize: 16,
            fontFamily: "Outfit-Medium",
            transform: [{ rotate: "-1.5deg" }],
            borderRadius: 5,
            padding: 5,
            backgroundColor: Colors.LIGHT_GREEN,
            boxShadow: "5px 5px",
          },
        ]}
      >
        💫 Your face, your story, your magic!
      </Text>
    </View>
  );
};

export default Introduction;

const styles = StyleSheet.create({
  main: {
    borderWidth: 2,
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: Colors.SECONDARY,
    marginTop: 30,
    marginBottom: 10,
    boxShadow: "7px 7px",
    borderRadius: 5,
  },
  textStyle: {
    textAlign: "center",
  },
});
