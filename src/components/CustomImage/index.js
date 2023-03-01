import { Image, TouchableOpacity } from "react-native";
import React from "react";

const CustomImage = ({
  imgSrc,
  alignSelf,
  marginTop,
  marginHorizontal,
  onpress,
}) => {
  return onpress ? (
    <TouchableOpacity onPress={onpress}>
      <Image
        style={{
          alignSelf: alignSelf,
          marginTop: marginTop,
          marginHorizontal: marginHorizontal,
        }}
        source={imgSrc}
      />
    </TouchableOpacity>
  ) : (
    <Image
      style={{
        alignSelf: alignSelf,
        marginTop: marginTop,
        marginHorizontal: marginHorizontal,
      }}
      source={imgSrc}
    />
  );
};

export default CustomImage;
