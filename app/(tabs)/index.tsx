import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  GestureResponderEvent,
  Text,
  TouchableOpacity,
} from "react-native";
import { Canvas, Path } from "@shopify/react-native-skia";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Camera from "@/components/Camera";
import Introduction from "@/components/Introduction";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CanvasContainer from "@/components/Canvas";

export default function App(): JSX.Element {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {!isCameraOn && <Introduction />}

      {!photo ? (
        isCameraOn ? (
          <Camera
            setIsCameraOn={setIsCameraOn}
            photo={photo}
            setPhoto={setPhoto}
          />
        ) : (
          <View style={styles.btnContainer}>
            <Text
              style={{
                marginBottom: 30,
                fontSize: 30,
                fontFamily: "Outfit-Bold",
                textAlign: "center",
                marginHorizontal: 10,
                fontWeight: "bold",
              }}
            >
              Click on the camera to capture smile! 😃
            </Text>
            <TouchableOpacity onPress={() => setIsCameraOn(true)}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Capture Smile</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <CanvasContainer photo={photo} setPhoto={setPhoto} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
  },
  camera: { flex: 1, width: "100%" },
  canvasContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  image: { position: "absolute", width: "100%", height: "100%" },
  canvas: { position: "absolute", width: "100%", height: "100%" },
  btnContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  btn: {
    borderWidth: 2,
    width: "80%",
    height: 60,
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    boxShadow: "5px 5px",
  },
  btnText: {
    textAlign: "center",
    fontSize: 25,
    marginRight: 10,
  },
  controls: {
    position: "absolute",
    bottom: 20,
    right: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  controlsNew: {
    position: "absolute",
    bottom: 20,
    right: -50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
});
