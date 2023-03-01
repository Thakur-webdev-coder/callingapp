import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";

export default StyleSheet.create({
  linearGradientStyle: {
    marginTop: hp(10),
    borderRadius: 10,
    marginHorizontal: wp(15),
    paddingVertical: 10,
  },
  buttonTextStyle: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    color:colors.white
  },
});
