import { CameraView } from "expo-camera";
import { Camera } from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";

export default function CameraScreen() {
  // const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [visionResponse, setVisionResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cameraView, setCameraView] = useState<CameraView | null>(null);

  // if (!permission) {
  //   return <View />;
  // }

  // if (!permission.granted) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.message}>
  //         We need your permission to access the camera
  //       </Text>
  //       <Button onPress={requestPermission} title="Grant Permission" />
  //     </View>
  //   );
  // }

  const toggleCameraFacing = () => {
    if (cameraView) {
      // cameraView.flipCamera();
    }
  };

  const capturePhoto = async () => {
    if (!cameraView) return;

    try {
      setLoading(true);
      const photo = await cameraView.takePictureAsync({
        base64: true,
        quality: 0.7, // Reduced quality for faster upload
      });

      setCapturedPhoto(photo.uri);
      if (photo?.base64) {
        await analyzeImage(photo.base64);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (base64: string) => {
    const apiKey = ""; // Replace with your API key
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    try {
      const response = await axios.post(url, {
        requests: [
          {
            image: { content: base64 },
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "OBJECT_LOCALIZATION", maxResults: 5 },
              { type: "TEXT_DETECTION" },
            ],
          },
        ],
      });
      setVisionResponse(response.data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      if (axios.isAxiosError(error)) {
        console.error("API Error details:", error.response?.data);
      }
    }
  };

  const resetCamera = () => {
    setCapturedPhoto(null);
    setVisionResponse(null);
  };

  return (
    <View style={styles.container}>
      {!capturedPhoto ? (
        <CameraView
          style={styles.camera}
          ref={(ref) => setCameraView(ref)}
          // enableHighQualityPhotos={true}
          onMountError={(error) => {
            console.error("Camera mount error:", error);
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
                disabled={loading}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={capturePhoto}
                disabled={loading}
              >
                <Text style={styles.text}>
                  {loading ? "Processing..." : "Capture"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
          <ScrollView style={styles.resultsContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : visionResponse ? (
              <View style={styles.detectionResults}>
                <Text style={styles.resultsTitle}>Detected Items:</Text>
                {visionResponse.responses[0]?.labelAnnotations?.map(
                  (label: any) => (
                    <Text key={label.description} style={styles.resultText}>
                      {label.description} - {Math.round(label.score * 100)}%
                    </Text>
                  )
                )}

                {visionResponse.responses[0]?.localizedObjectAnnotations
                  ?.length > 0 && (
                  <>
                    <Text style={styles.resultsTitle}>Objects Found:</Text>
                    {visionResponse.responses[0].localizedObjectAnnotations.map(
                      (obj: any) => (
                        <Text
                          key={`${obj.name}-${obj.score}`}
                          style={styles.resultText}
                        >
                          {obj.name} - {Math.round(obj.score * 100)}%
                        </Text>
                      )
                    )}
                  </>
                )}

                {visionResponse.responses[0]?.textAnnotations?.length > 0 && (
                  <>
                    <Text style={styles.resultsTitle}>Text Detected:</Text>
                    <Text style={styles.resultText}>
                      {
                        visionResponse.responses[0].textAnnotations[0]
                          .description
                      }
                    </Text>
                  </>
                )}
              </View>
            ) : (
              <Text style={styles.errorText}>No results available</Text>
            )}
            <TouchableOpacity style={styles.retakeButton} onPress={resetCamera}>
              <Text style={styles.retakeText}>Take Another Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 120,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  capturedImage: {
    flex: 1,
    resizeMode: "contain",
  },
  resultsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    maxHeight: "50%",
  },
  detectionResults: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    marginBottom: 5,
  },
  resultText: {
    color: "white",
    fontSize: 16,
    marginBottom: 3,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  retakeButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  retakeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
