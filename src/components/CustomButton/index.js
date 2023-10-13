import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import colors from "../../../assets/colors";
import { icon_arrow } from "../../routes/imageRoutes";

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
  icon,
}) => {
  const getGradientColors = () => {
    if (disabled) {
      return [colors.secondary, colors.secondary];
    }
    if (primary) {
      return ["#FD2A46", "#F8B502"];
    }
    if (danger) {
      return [colors.danger, colors.danger];
    }
    if (secondary) {
      return [colors.secondary, colors.secondary];
    } else {
      return [colors.buttonBlack, colors.buttonBlack];
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: horzontalPadding,
        marginTop: marginTop,
      }}
    >
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <LinearGradient // Use LinearGradient for the background
          colors={getGradientColors()} // Set the gradient colors
          start={{ x: 0, y: 0.2 }} // Start from the middle (top)
          end={{ x: 0, y: 1 }} // End at the bottom
          style={[styles.wrapper]}
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
          {icon ? (
            <View style={styles.icon}>
              <Image
                source={icon_arrow}
                resizeMode="contain"
                style={{ height: 20,width:20 }}
              />
            </View>
          ) : null}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
