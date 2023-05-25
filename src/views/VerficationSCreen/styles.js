import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  phoneViewStyle: {
    backgroundColor: colors.white,
    elevation: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: hp(8),
    borderRadius: 10,
    marginHorizontal: wp(5),
  },

  flagStyle: {
    backgroundColor: colors.inputColor,
    borderColor: colors.inputColor,
  },

  inputTextStyle: {
    color: colors.black,
    fontSize: 16,
  },

  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // backgroundColor: "red",
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: "pink",
  },
  wrapper2: {
    backgroundColor: colors.secondary,
    flex: 1,
    borderTopLeftRadius: 50,
  },
});
