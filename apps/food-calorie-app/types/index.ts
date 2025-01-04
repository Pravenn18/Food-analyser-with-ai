export interface NutritionInfo {
  foodItem: string;
  calories: number;
  totalFat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrate: number;
  dietaryFiber: number;
  sugars: number;
  protein: number;
  potassium: number;
  phosphorus: number;
  servingQty: number;
  servingUnit: string;
  servingWeightGrams: number;
  confidence: number;
}

export interface VisionResponse {
  labelAnnotations?: Array<{
    description: string;
    score: number;
  }>;
  localizedObjectAnnotations?: Array<{
    name: string;
    score: number;
  }>;
}
