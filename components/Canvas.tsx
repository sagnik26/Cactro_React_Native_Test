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
import { Colors } from "@/constants/Colors";

const colors = ["black", "red", "blue", "green", "purple"];
const strokeWidths = [2, 4, 6, 8, 10];

interface Props {
  photo: string | null;
  setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}

const CanvasContainer: React.FC<Props> = ({ photo, setPhoto }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [strokeColor, setStrokeColor] = useState<string>("black");
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState<boolean>(false);
  const [isColorPickerEnabled, setIsColorPickerEnabled] =
    useState<boolean>(false);
  const [isStrokePickerEnabled, setIsStrokePickerEnabled] =
    useState<boolean>(false);

  const handleTouchStart = (event: GestureResponderEvent): void => {
    if (!isDrawingEnabled) return;
    const touch = event.nativeEvent.touches[0]; // Get the first touch point
    if (touch) {
      setCurrentPath(`M${touch.locationX},${touch.locationY}`);
    }
  };

  const handleTouchMove = (event: GestureResponderEvent): void => {
    if (!isDrawingEnabled) return;
    const touch = event.nativeEvent.touches[0];
    if (touch) {
      setCurrentPath(
        (prev) => prev + ` L${touch.locationX},${touch.locationY}`
      );
    }
  };

  const handleTouchEnd = (): void => {
    if (!isDrawingEnabled) return;
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

      <View style={styles.controlsTop}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "70%",
            marginHorizontal: "auto",
            borderRadius: 32,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsColorPickerEnabled(false);
              setIsStrokePickerEnabled(false);
              setIsDrawingEnabled(!isDrawingEnabled);
            }}
          >
            <Text style={[styles.btnText, styles.controlBtn]}>
              {isDrawingEnabled ? "Disable Draw" : "Enable Draw"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsStrokePickerEnabled(false);
              setIsColorPickerEnabled(!isColorPickerEnabled);
            }}
            disabled={!isDrawingEnabled}
          >
            <Text style={[styles.btnText, styles.controlBtn]}>Color</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsColorPickerEnabled(false);
              setIsStrokePickerEnabled(!isStrokePickerEnabled);
            }}
            disabled={!isDrawingEnabled}
          >
            <Text style={[styles.btnText, styles.controlBtn]}>Stroke</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.controlsBottom}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity onPress={discardPhoto}>
            <Text style={[styles.btnText, styles.controlBtn]}>back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearCanvas}>
            <Text style={[styles.btnText, styles.controlBtn]}>
              Clear Canvas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isColorPickerEnabled && (
        <View style={styles.controls}>
          <View style={styles.selectorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setStrokeColor(color)}
                style={[styles.colorBox, { backgroundColor: color }]}
              />
            ))}
          </View>
        </View>
      )}

      {isStrokePickerEnabled && (
        <View style={styles.controls}>
          <View style={styles.selectorContainer}>
            {strokeWidths.map((width) => (
              <TouchableOpacity
                key={width}
                onPress={() => setStrokeWidth(width)}
                style={styles.strokeBox}
              >
                <Text>{width}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
    fontSize: 16,
    marginRight: 10,
  },
  controls: {
    position: "absolute",
    top: 60,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  controlsTop: {
    position: "absolute",
    top: 20,
    width: "90%",
    backgroundColor: Colors.PRIMARY,
    padding: 5,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    borderRadius: 32,
  },
  controlsBottom: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    left: "50%",
    transform: [{ translateX: "-50%" }],
    borderRadius: 32,
  },
  selectorContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    backgroundColor: "#ffffff",
    width: "70%",
    marginHorizontal: "auto",
    borderRadius: 10,
  },
  colorBox: { width: 25, height: 25, margin: 5, borderRadius: 5 },
  strokeBox: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    margin: 5,
    borderRadius: 5,
  },
  controlBtn: {
    backgroundColor: Colors.LIGHT_GREEN,
    paddingHorizontal: 10,
    borderRadius: 30,
    fontWeight: "bold",
    color: Colors["theme-gray"][800],
  },
});
