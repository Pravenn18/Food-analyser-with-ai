import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface DropdownProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: object;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder,
  style,
}) => {
  return (
    <View style={[styles.dropdownContainer, style]}>
      {placeholder && <Text style={styles.placeholder}>{placeholder}</Text>}
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {options.map((option, index) => (
          <Picker.Item key={index} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: "45%",
    height: 40,
    marginLeft: 20,
  },
  picker: {
    height: 50,
    color: "#fff",
  },
  placeholder: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
});
