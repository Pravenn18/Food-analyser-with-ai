import axios from "axios";
import { NutritionInfo } from "../types";
import { CONFIG } from "@/constants/Index";

export class NutritionService {
  static async fetchNutritionInfo(
    foodItem: string
  ): Promise<NutritionInfo | null> {
    try {
      const query = this.formatQuery(foodItem);
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query },
        {
          headers: {
            "Content-Type": "application/json",
            "x-app-id": CONFIG.NUTRITION_API.APP_ID,
            "x-app-key": CONFIG.NUTRITION_API.API_KEY,
          },
        }
      );
      console.log("response", JSON.stringify(response));
      return this.parseResponse(response.data);
    } catch (error) {
      console.error("Error fetching nutrition info:", error);
      return null;
    }
  }

  private static formatQuery(foodItem: string): string {
    return foodItem.includes(" piece") || foodItem.includes(" serving")
      ? foodItem
      : `1 serving ${foodItem}`;
  }

  private static parseResponse(data: any): NutritionInfo | null {
    if (data?.foods?.[0]) {
      const food = data.foods[0];
      return {
        foodItem: food.food_name,
        calories: food.nf_calories,
        totalFat: food.nf_total_fat,
        saturatedFat: food.nf_saturated_fat,
        cholesterol: food.nf_cholesterol,
        sodium: food.nf_sodium,
        totalCarbohydrate: food.nf_total_carbohydrate,
        dietaryFiber: food.nf_dietary_fiber,
        sugars: food.nf_sugars,
        protein: food.nf_protein,
        potassium: food.nf_potassium,
        phosphorus: food.nf_p,
        servingQty: food.serving_qty,
        servingUnit: food.serving_unit,
        servingWeightGrams: food.serving_weight_grams,
        confidence: 1.0,
      };
    }
    return null;
  }
}
