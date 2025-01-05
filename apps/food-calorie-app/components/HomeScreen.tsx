import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Easing } from "react-native-reanimated";

const { width } = Dimensions.get("window");

// TODO: optimise code by using animated from reanimated
export default function HomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const cameraButtonAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const nutrients = [
    {
      icon: "fire",
      title: "Calories",
      value: "1,200",
      unit: "kcal",
      target: "2,000",
      color: "#FF6B6B",
    },
    {
      icon: "food-steak",
      title: "Protein",
      value: "50",
      unit: "g",
      target: "80",
      color: "#4ECDC4",
    },
    {
      icon: "bread-slice",
      title: "Carbs",
      value: "150",
      unit: "g",
      target: "250",
      color: "#FFD93D",
    },
    {
      icon: "oil",
      title: "Fats",
      value: "45",
      unit: "g",
      target: "65",
      color: "#95A5A6",
    },
  ];

  const mealHistory = [
    { time: "Breakfast", calories: 350, items: "Oatmeal, Banana, Coffee" },
    { time: "Lunch", calories: 550, items: "Grilled Chicken Salad, Apple" },
    { time: "Snack", calories: 300, items: "Greek Yogurt, Almonds" },
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleCameraPress = () => {
    Animated.sequence([
      Animated.timing(cameraButtonAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(cameraButtonAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderNutrientCard = ({ icon, title, value, unit, target, color }) => (
    <Animated.View
      key={title}
      style={[
        styles.nutrientCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.nutrientInfo}>
        <Text style={styles.nutrientTitle}>{title}</Text>
        <Text style={styles.nutrientValue}>
          {value}
          <Text style={styles.nutrientUnit}> {unit}</Text>
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(parseFloat(value.replace(",", "")) / parseFloat(target.replace(",", ""))) * 100}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        <Text style={styles.targetText}>
          Target: {target} {unit}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#434343", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <View>
            <Animated.Text style={[styles.greeting, { opacity: fadeAnim }]}>
              Good {getTimeOfDay()}!
            </Animated.Text>
            <Animated.Text style={[styles.date, { opacity: fadeAnim }]}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Animated.Text>
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.nutrientsContainer}>
            {nutrients.map(renderNutrientCard)}
          </View>
          <View style={styles.mealHistoryContainer}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            {mealHistory.map((meal, index) => (
              <Animated.View
                key={meal.time}
                style={[
                  styles.mealCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50 * (index + 1), 0],
                        }),
                      },
                      {
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </View>
                <Text style={styles.mealItems}>{meal.items}</Text>
              </Animated.View>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
        <TouchableOpacity
          onPress={handleCameraPress}
          style={styles.cameraButtonContainer}
        >
          <View style={styles.cameraButtonWrapper}>
            <Animated.View
              style={[
                styles.shineEffect,
                {
                  transform: [{ rotate: spin }, { scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(255, 255, 255, 0.6)",
                  "transparent",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shine}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.cameraButtonOuter,
                {
                  transform: [{ scale: cameraButtonAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["#FF6B6B", "#4ECDC4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cameraButtonGradient}
              >
                <MaterialCommunityIcons name="camera" size={35} color="white" />
              </LinearGradient>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Optional semi-transparent background
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  scrollView: {
    flex: 1,
  },
  nutrientsContainer: {
    padding: 15,
  },
  nutrientCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  nutrientInfo: {
    flex: 1,
  },
  nutrientTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e1e1e",
    marginBottom: 4,
  },
  nutrientValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e1e1e",
    marginBottom: 8,
  },
  nutrientUnit: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#666",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  targetText: {
    fontSize: 12,
    color: "#666",
  },
  mealHistoryContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  mealCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mealTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e1e1e",
  },
  mealCalories: {
    fontSize: 14,
    color: "#666",
  },
  mealItems: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  cameraButtonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    zIndex: 999,
  },
  cameraButtonWrapper: {
    width: 85,
    height: 85,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButtonOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    position: "absolute",
  },
  cameraButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  iconWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 35,
  },
  cameraIcon: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  shineEffect: {
    width: 85,
    height: 85,
    borderRadius: 43,
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  shine: {
    width: "100%",
    height: "100%",
    borderRadius: 43,
  },
});
