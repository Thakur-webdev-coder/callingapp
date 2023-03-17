import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  mainViewStyle: {
    marginTop: hp(3),
    marginBottom: hp(0.5),
    backgroundColor: "white",
    color: "white",
  },
});
