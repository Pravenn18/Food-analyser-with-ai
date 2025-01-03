import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  GestureResponderEvent,
} from "react-native";
import { NutritionInfo } from "../types";

interface NutritionResultsProps {
  nutritionData: NutritionInfo[];
  onRetake: () => void;
  isVisible: boolean;
}

function addItemIntoDB(event: GestureResponderEvent): void {
  throw new Error("Function not implemented.");
}

export const NutritionResults: React.FC<NutritionResultsProps> = ({
  nutritionData,
  onRetake,
  isVisible,
}) => (
  <Modal visible={isVisible} animationType="slide" transparent={true}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Food Analysis</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onRetake}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent}>
          {nutritionData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.nutritionItem}
              onPress={addItemIntoDB}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.foodName}>{item.foodItem}</Text>
                <Text style={styles.confidence}>
                  {Math.round(item.confidence * 100)}%
                </Text>
              </View>
              <Text style={styles.calories}>
                {Math.round(item.calories)} kcal
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
            <Text style={styles.retakeText}>Take Another Photo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "50%",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  scrollContent: {
    maxHeight: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: "#fff",
    fontSize: 20,
  },
  nutritionItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  confidence: {
    fontSize: 14,
    color: "#4CAF50",
  },
  calories: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
  retakeButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  retakeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
