import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  inputStyle: {
    color: colors.black,
    backgroundColor: colors.otpBgColor,
    borderRadius: 10,
    marginTop: hp(8),
    borderBottomWidth: 0,
  },

  wrapper: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  wrapper2: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 50,
    marginTop: hp(8),
  },
});
