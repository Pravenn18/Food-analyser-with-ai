export interface NutritionInfo {
  foodItem: string;
  calories: number;
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
