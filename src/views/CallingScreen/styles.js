import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";

export default StyleSheet.create({
  timerText: {
    color: colors.black,
    alignSelf: "center",
    marginTop: hp(2),
    fontSize: 12,
    fontWeight: "bold",
  },

  callingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(10),
    marginTop: hp(5),
  },
});
