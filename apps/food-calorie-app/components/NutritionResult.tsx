import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { NutritionInfo } from "../types";
import { InputText } from "./InputText";
import { Dropdown } from "./DropDown";

interface NutritionResultsProps {
  nutritionData: NutritionInfo[];
  onRetake: () => void;
  isVisible: boolean;
}

function addItemIntoDB(
  item: NutritionInfo,
  quantity: number,
  mealType: string
): void {
  console.log("Adding item to DB:", { item, quantity, mealType });
  // Implement database addition logic here.
}

export const NutritionResults: React.FC<NutritionResultsProps> = ({
  nutritionData,
  onRetake,
  isVisible,
}) => {
  const [selectedQuantities, setSelectedQuantities] = useState<number[]>(
    new Array(nutritionData.length).fill(100)
  );
  const [selectedMeals, setSelectedMeals] = useState<string[]>(
    new Array(nutritionData.length).fill("Breakfast")
  );
  useEffect(() => {
    console.log("NutritionData length:", nutritionData.length);
    if (nutritionData.length > 0) {
      setSelectedQuantities(new Array(nutritionData.length).fill(100));
      setSelectedMeals(new Array(nutritionData.length).fill("Breakfast"));
    }
  }, [nutritionData]);
  console.log("selectedQuantities", JSON.stringify(selectedQuantities));

  const updateField = <T extends unknown>(
    index: number,
    value: T,
    stateUpdater: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    stateUpdater((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = value;
      return updatedState;
    });
  };

  const calculateNutrients = (item: NutritionInfo, multiplier: number) => {
    // Ensure multiplier is a valid number and defaulting to 1 if invalid
    const safeMultiplier =
      !isNaN(multiplier) && multiplier > 0 ? multiplier : 1;

    return {
      calories: Number((item.calories * safeMultiplier).toFixed(1)),
      totalFat: Number((item.totalFat * safeMultiplier).toFixed(1)),
      saturatedFat: Number((item.saturatedFat * safeMultiplier).toFixed(1)),
      cholesterol: Number((item.cholesterol * safeMultiplier).toFixed(1)),
      sodium: Number((item.sodium * safeMultiplier).toFixed(1)),
      totalCarbohydrate: Number(
        (item.totalCarbohydrate * safeMultiplier).toFixed(1)
      ),
      dietaryFiber: Number((item.dietaryFiber * safeMultiplier).toFixed(1)),
      sugars: Number((item.sugars * safeMultiplier).toFixed(1)),
      protein: Number((item.protein * safeMultiplier).toFixed(1)),
      potassium: Number((item.potassium * safeMultiplier).toFixed(1)),
      phosphorus: Number((item.phosphorus * safeMultiplier).toFixed(1)),
    };
  };

  const handleQuantityChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      if (!isNaN(numValue) && numValue >= 0) {
        setSelectedQuantities((prev) => {
          const newQuantities = [...prev];
          newQuantities[index] = numValue;
          console.log("New quantities array:", newQuantities);
          return newQuantities;
        });
      }
    }
  };

  return (
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
            {nutritionData.map((item, index) => {
              const nutrients = calculateNutrients(
                item,
                selectedQuantities[index] / 100
              );
              return (
                <View key={index} style={styles.nutritionItem}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.foodName}>{item.foodItem}</Text>
                    <Text style={styles.confidence}>
                      {Math.round(item.confidence * 100)}%
                    </Text>
                  </View>
                  <Text style={styles.calories}>{nutrients.calories} kcal</Text>

                  <View style={styles.nutrientDetails}>
                    <Text style={styles.nutrientText}>
                      Protein: {nutrients.protein} g
                    </Text>
                    <Text style={styles.nutrientText}>
                      Carbs: {nutrients.totalCarbohydrate} g
                    </Text>
                    <Text style={styles.nutrientText}>
                      Fats: {nutrients.totalFat} g
                    </Text>
                    <Text style={styles.nutrientText}>
                      Fiber: {nutrients.dietaryFiber} g
                    </Text>
                    <Text style={styles.nutrientText}>
                      Sugars: {nutrients.sugars} g
                    </Text>
                    <Text style={styles.nutrientText}>
                      Sodium: {nutrients.sodium} mg
                    </Text>
                  </View>

                  <View style={styles.customizationContainer}>
                    <InputText
                      value={selectedQuantities[index]}
                      onChangeText={(value) =>
                        handleQuantityChange(index, value)
                      }
                      keyboardType="numeric"
                      label="Quantity (g)"
                    />
                    <Dropdown
                      options={[
                        { label: "Breakfast", value: "Breakfast" },
                        { label: "Lunch", value: "Lunch" },
                        { label: "Dinner", value: "Dinner" },
                      ]}
                      selectedValue={selectedMeals[index]}
                      onValueChange={(value) =>
                        updateField(index, value, setSelectedMeals)
                      }
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                      addItemIntoDB(
                        item,
                        selectedQuantities[index],
                        selectedMeals[index]
                      )
                    }
                  >
                    <Text style={styles.addButtonText}>Add Dish</Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
              <Text style={styles.retakeText}>Take Another Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "60%",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
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
  scrollContent: {
    paddingBottom: 20,
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
    marginBottom: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  confidence: {
    fontSize: 14,
    color: "#4CAF50",
  },
  calories: {
    fontSize: 16,
    color: "#4CAF50",
    marginVertical: 8,
  },
  nutrientDetails: {
    marginVertical: 8,
  },
  nutrientText: {
    color: "#fff",
    fontSize: 14,
    marginVertical: 2,
  },
  customizationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addButton: {
    marginTop: 12,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  retakeButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  retakeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NutritionResults;
