import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.black,
    flexDirection: "column",
  },
  backArrowBox: {
    height: hp(2),
    width: wp(3),
    padding: 10,
  },
  avatarStyle: {
    alignSelf: "center",

    marginTop: hp(3),
  },
  videoStyle: {
    height: 530,
    width: 350,
    alignSelf: "center",
    marginTop: hp(3),
  },
  bottomStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: wp(3),
    backgroundColor: colors.white,
    paddingBottom: hp(1),
    flex: 0.55,

    // alignContent:'flex-end',
    // /backgroundColor:'red'
  },
});
