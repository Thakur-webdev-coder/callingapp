import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";

export default StyleSheet.create({
  mainView: {
    padding: wp(5),
  },

  container_view: {
    flexDirection: "row",
  },
  container_view2: {
    marginTop: hp(10),
    flexDirection: "row",
    justifyContent: "space-between",
  },

  textStyle: {
    color: colors.black,
    fontSize: 14,
    alignSelf: "center",
    marginStart: wp(5),
  },
  mobileNumberText: {
    color: colors.black,
    fontSize: 14,
    marginHorizontal: wp(5),
  },

  iconTilteStle: {
    color: colors.secondary,
    fontSize: 14,
    alignSelf: "center",
  },

  horizontalLine: {
    marginTop: hp(1),
    borderWidth: 0.3,
    borderColor: colors.black,
  },
});
