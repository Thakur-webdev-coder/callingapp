import React from "react";
import { View, Text, Button } from "react-native";
import CustomButton from "../components/CustomButton";

const CustomNotification = ({ title, message, data, navigation }) => {
  return (
    <View>
      <Text>{title}</Text>
      <Text>{message}</Text>
      <CustomButton
        title={"Answer"}
        primary
        horzontalPadding={wp(15)}
        marginTop={hp(2)}
        //disabled={counter != 0}
        onPress={() =>
          navigation.navigate("IncomingScreen", {
            callData: remoteMessage?.data,
          })
        }
      />
    </View>
  );
};

export default CustomNotification;
