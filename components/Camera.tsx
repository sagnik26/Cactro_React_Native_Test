import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraCapturedPicture,
} from "expo-camera";
import { Colors } from "@/constants/Colors";

interface CameraProps {
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
  photo: any | null;
  setPhoto: (arg: any | null) => void;
}

const Camera: React.FC<CameraProps> = ({ setIsCameraOn, photo, setPhoto }) => {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission}>
          <View style={styles.grantPermissionBtn}>
            <Text style={styles.grantPermissionBtnTxt}>grant permission</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePhoto = async (): Promise<void> => {
    if (cameraRef.current) {
      const photo: CameraCapturedPicture =
        await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      <View
        style={{
          marginVertical: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          width: "85%",
        }}
      >
        <View style={{ width: "40%" }}>
          <Button
            color={Colors.LIGHT_GREEN}
            title="Go Back"
            onPress={() => setIsCameraOn(false)}
          />
        </View>

        <View style={{ width: "40%" }}>
          <Button
            color={Colors.LIGHT_GREEN}
            title={photo ? "Retake Photo" : "Take Photo"}
            onPress={() => (photo ? setPhoto(null) : takePhoto())}
          />
        </View>
      </View>
    </>
  );
};

export default Camera;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 30,
    borderWidth: 2,
    width: "90%",
    flex: 1,
    boxShadow: "7px 7px",
    borderRadius: 5,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 50,
    borderWidth: 2,
    padding: 20,
    borderRadius: 5,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontFamily: "Outfit-Medium",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  grantPermissionBtn: {
    width: "80%",
    marginHorizontal: "auto",
    borderRadius: 5,
    padding: 10,
    backgroundColor: Colors.LIGHT_GREEN,
    boxShadow: "5px 5px",
  },
  grantPermissionBtnTxt: {
    textAlign: "center",
    fontFamily: "Outfit-Bold",
    fontSize: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
