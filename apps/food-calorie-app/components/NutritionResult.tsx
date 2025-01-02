import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NutritionInfo } from "../types";

interface NutritionResultsProps {
  nutritionData: NutritionInfo[];
  onRetake: () => void;
  isFood: boolean;
}

export const NutritionResults: React.FC<NutritionResultsProps> = ({
  nutritionData,
  onRetake,
  isFood,
}) => (
  <ScrollView style={styles.resultsContainer}>
    <View style={styles.detectionResults}>
      {isFood ? (
        <>
          <Text style={styles.resultsTitle}>Food Analysis:</Text>
          {nutritionData.map((item, index) => (
            <View key={index} style={styles.nutritionItem}>
              <Text style={styles.resultText}>
                {item.foodItem} ({Math.round(item.confidence * 100)}%
                confidence)
              </Text>
              <Text style={styles.calorieText}>
                Calories: {Math.round(item.calories)} kcal
              </Text>
            </View>
          ))}
        </>
      ) : (
        <Text style={styles.resultText}>
          No food items detected in the image
        </Text>
      )}
    </View>
    <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
      <Text style={styles.retakeText}>Take Another Photo</Text>
    </TouchableOpacity>
  </ScrollView>
);

const styles = StyleSheet.create({
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
  nutritionItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  calorieText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});
