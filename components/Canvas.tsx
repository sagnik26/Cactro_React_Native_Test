import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Canvas, Path } from "@shopify/react-native-skia";
import React, { useState } from "react";

interface Props {
  photo: string | null;
  setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}

const CanvasContainer: React.FC<Props> = ({ photo, setPhoto }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [strokeColor, setStrokeColor] = useState<string>("black");
  const [strokeWidth, setStrokeWidth] = useState<number>(4);

  const handleTouchStart = (event: GestureResponderEvent): void => {
    const touch = event.nativeEvent.touches[0]; // Get the first touch point
    if (touch) {
      setCurrentPath(`M${touch.locationX},${touch.locationY}`);
    }
  };

  const handleTouchMove = (event: GestureResponderEvent): void => {
    const touch = event.nativeEvent.touches[0];
    if (touch) {
      setCurrentPath(
        (prev) => prev + ` L${touch.locationX},${touch.locationY}`
      );
    }
  };

  const handleTouchEnd = (): void => {
    setPaths([...paths, currentPath]);
    setCurrentPath("");
  };

  const clearCanvas = () => {
    setPaths([]);
  };

  const discardPhoto = () => {
    setPhoto(null);
  };

  return (
    <View style={styles.canvasContainer}>
      <Image source={{ uri: photo }} style={styles.image} />
      <Canvas
        style={styles.canvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {paths.map((p, index) => (
          <Path
            key={index}
            path={p}
            strokeWidth={strokeWidth}
            color={strokeColor}
            style="stroke"
          />
        ))}
        {currentPath && (
          <Path
            path={currentPath}
            strokeWidth={strokeWidth}
            color={strokeColor}
            style="stroke"
          />
        )}
      </Canvas>
      <View style={styles.controls}>
        <TouchableOpacity onPress={clearCanvas}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Clear</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.controlsNew}>
        <TouchableOpacity onPress={discardPhoto}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>discard</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CanvasContainer;

const styles = StyleSheet.create({
  canvasContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  image: { position: "absolute", width: "100%", height: "100%" },
  canvas: { position: "absolute", width: "100%", height: "100%" },
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
