import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
  Linking,
  Platform,
  TextInput,
  Button,
} from "react-native";
import {
  Canvas,
  Skia,
  Path,
  Image as SkImage,
  PaintStyle,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import * as FileSystem from "expo-file-system";
import Share from "react-native-share";
import DeviceInfo from "react-native-device-info";
import * as MediaLibrary from "expo-media-library";

const getAppId = () => {
  return DeviceInfo.getBundleId(); // Automatically gets the App ID from the app's package
};

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
  const [isCaptionInput, setIsCaptionInput] = useState<boolean>(false);
  const [isColorPickerEnabled, setIsColorPickerEnabled] =
    useState<boolean>(false);
  const [isStrokePickerEnabled, setIsStrokePickerEnabled] =
    useState<boolean>(false);
  const [caption, setCaption] = useState<string>("");

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

  const shareToInstagram = async (caption: string) => {
    try {
      if (!photo) return;

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Media Library permission is required to save images.");
        return;
      }

      const APP_ID = getAppId();

      // Read the image as Base64
      const base64Image = await FileSystem.readAsStringAsync(photo, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert Base64 to Skia Image
      const skData = Skia.Data.fromBase64(base64Image);
      const image = Skia.Image.MakeImageFromEncoded(skData);

      if (!image) {
        console.error("Failed to create Skia Image");
        return;
      }

      // Create Skia Surface
      const surface = Skia.Surface.Make(image.width(), image.height());
      if (!surface) {
        console.error("Failed to create Skia Surface");
        return;
      }
      const canvas = surface.getCanvas();
      canvas.drawImage(image, 0, 0);

      // Draw strokes using Skia Paint
      const paint = Skia.Paint();
      paint.setColor(Skia.Color(strokeColor));
      paint.setStrokeWidth(strokeWidth);
      paint.setStyle(PaintStyle.Stroke);

      paths.forEach((p) => {
        const path = Skia.Path.MakeFromSVGString(p);
        if (path) {
          canvas.drawPath(path, paint);
        }
      });

      // Generate the final merged image
      const snapshot = surface.makeImageSnapshot();
      if (!snapshot) {
        console.error("Failed to create image snapshot.");
        return;
      }

      // Convert Skia snapshot to a real image file
      const mergedImageUri = FileSystem.cacheDirectory + "merged_photo.jpg";
      const imageBase64 = snapshot.encodeToBase64();

      // Ensure the image is correctly saved
      await FileSystem.writeAsStringAsync(mergedImageUri, imageBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(mergedImageUri);

      // Open Instagram Stories with the edited image
      if (Platform.OS === "ios") {
        const instagramUrl = `instagram-stories://share?backgroundImage=${mergedImageUri}`;
        Linking.openURL(instagramUrl).catch(() =>
          alert("Instagram is not installed or does not support sharing.")
        );
      } else {
        const shareOptions: any = {
          title: "Share to Instagram",
          url: `file://${mergedImageUri}`,
          social: Share.Social.INSTAGRAM_STORIES,
          stickerImage: `file://${mergedImageUri}`,
          message: caption,
          appId: APP_ID,
        };
        await Share.shareSingle(shareOptions);
      }
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
    }
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
              setIsCaptionInput(!isCaptionInput);
            }}
          >
            <Text style={[styles.btnText, styles.controlBtn]}>Add Caption</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsStrokePickerEnabled(false);
              setIsColorPickerEnabled(!isColorPickerEnabled);
            }}
          >
            <Text style={[styles.btnText, styles.controlBtn]}>Color</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsColorPickerEnabled(false);
              setIsStrokePickerEnabled(!isStrokePickerEnabled);
            }}
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
          <TouchableOpacity
            onPress={() => {
              if (photo) {
                if (photo) {
                  shareToInstagram(caption);
                }
              }
            }}
            style={[styles.btnText, styles.controlBtn]}
          >
            <Text style={styles.btnText}>Share to IG</Text>
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

      {isCaptionInput && (
        <View style={styles.captionContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Enter your caption"
            value={caption}
            onChangeText={setCaption}
          />
          <Button title="->" onPress={() => setIsCaptionInput(false)} />
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
  captionInput: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    backgroundColor: "white",
    fontSize: 16,
    textAlign: "center",
  },
  captionContainer: {
    position: "absolute",
    top: 80,
    left: "50%",
    transform: [{ translateX: "-45%" }],
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
});
