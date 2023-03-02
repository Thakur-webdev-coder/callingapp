import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./styles";
import colors from "../../../assets/colors";

const CustomButton = ({
  title,
  secondary,
  primary,
  danger,
  disabled,
  onPress,
  loading,
  marginTop,
  horzontalPadding,
  paddingVertical,
}) => {
  const getBgColor = () => {
    if (disabled) {
      return colors.buttonColor;
    }
    if (primary) {
      return colors.buttonColor;
    }
    if (danger) {
      return colors.danger;
    }
    if (secondary) {
      return colors.secondary;
    }
  };
  return (
    <View
      style={{
        paddingHorizontal: horzontalPadding,
        marginTop: marginTop,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.wrapper, { backgroundColor: getBgColor() }]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              paddingVertical: paddingVertical,
              color: disabled ? colors.disableColor : colors.white,
            },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
