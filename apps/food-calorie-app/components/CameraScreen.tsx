import React, { useState, useCallback } from "react";
import { View, Image, ActivityIndicator, StyleSheet, Text } from "react-native";
import { CameraView } from "expo-camera";
import { VisionService } from "../services/VisionService";
import { NutritionService } from "../services/NutritionService";
import { NutritionInfo } from "../types";
import { FoodDetectionUtils } from "@/utils/FoodDetection";
import { NutritionResults } from "./NutritionResult";
import { CameraControls } from "./CameraControl";

export default function CameraScreen() {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraView, setCameraView] = useState<CameraView | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionInfo[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleImageAnalysis = async (base64: string) => {
    const visionResponse = await VisionService.analyzeImage(base64);
    if (!visionResponse) return;

    const foodLabels = FoodDetectionUtils.extractFoodLabels(visionResponse);

    if (foodLabels.length > 0) {
      const nutritionPromises = foodLabels.map(async (label) => {
        const nutrition = await NutritionService.fetchNutritionInfo(
          label.description
        );
        return nutrition ? { ...nutrition, confidence: label.score } : null;
      });

      const nutritionResults = (await Promise.all(nutritionPromises)).filter(
        (result): result is NutritionInfo => result !== null
      );
      setNutritionData(nutritionResults);
      setShowResults(true);
    }
  };

  const capturePhoto = async () => {
    if (!cameraView) return;

    try {
      setLoading(true);
      const photo = await cameraView.takePictureAsync({
        base64: true,
        quality: 0.7,
      });

      setCapturedPhoto(photo.uri);
      if (photo?.base64) {
        await handleImageAnalysis(photo.base64);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetCamera = useCallback(() => {
    setCapturedPhoto(null);
    setNutritionData([]);
    setShowResults(false);
  }, []);

  return (
    <View style={styles.container}>
      {!capturedPhoto ? (
        <CameraView
          style={styles.camera}
          ref={(ref) => setCameraView(ref)}
          onMountError={(error) => console.error("Camera mount error:", error)}
        >
          <View style={styles.overlay}>
            <CameraControls
              onCapture={capturePhoto}
              onFlip={() => {}}
              loading={loading}
            />
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          <NutritionResults
            nutritionData={nutritionData}
            onRetake={resetCamera}
            isVisible={showResults}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  previewContainer: {
    flex: 1,
  },
  capturedImage: {
    flex: 1,
    resizeMode: "contain",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
