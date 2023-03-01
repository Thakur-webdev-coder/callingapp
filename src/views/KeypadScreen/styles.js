import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.appColor,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  imgBackground: {
    marginTop: hp(2),

    borderRadius: 10,
    padding: 12,
  },
  imgBackStyle: {
    borderRadius: 10,
    overflow: "hidden",
  },
  bottomRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(5),
    paddingHorizontal: wp(5),
  },
  linearGradient: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomImgStyle: {
    marginTop: hp(3),
  },
  inputTxtBoxStyle: {
    backgroundColor: colors.appColor,
    borderRadius: 10,
    marginLeft: wp(5),
    width: wp(73),
    color: colors.white,
    fontSize: 26,
    alignSelf: "center",
    marginTop: hp(4),
    textAlign:'center'
  },

  dialerStyle: {
    backgroundColor: colors.appColor,
    borderColor: colors.bordercolor,
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 50,
    height: 75,
    width: 75,
    marginTop: hp(3),
  },
});
