import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";

export default StyleSheet.create({
  timerText: {
    color: colors.primary,
    alignSelf: "center",
    marginTop: hp(8),
    fontSize: 18,
    fontWeight: "bold",
  },

  callingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(10),
    marginTop: hp(5),
  },
});
