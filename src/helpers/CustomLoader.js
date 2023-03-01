import { View, ActivityIndicator } from "react-native";
import React from "react";
import colors from "../../assets/colors";
import { useSelector } from "react-redux";

const CustomLoader = () => {
  const { isLoadingEnable } = useSelector((store) => store);
  console.log("herereeee", isLoadingEnable);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator
        animating={isLoadingEnable}
        color={colors.primary}
        size="small"
      />
    </View>
  );
};

export default CustomLoader;
