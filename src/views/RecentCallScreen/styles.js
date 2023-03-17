import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  flatListStyle: {
    flexDirection: "row",
    marginBottom: hp(1),
    // marginTop:hp(1),
    paddingHorizontal: wp(5),
    paddingTop: hp(0.5),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
  },
  containerStyle: {
    paddingVertical: hp(2),
  },
  linearGradient: {
    backgroundColor: colors.primary,
    height: 48,
    width: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  userDetailView: {
    marginLeft: wp(4),
    width: wp(65),
  },

  imgstyle: {
    alignSelf: "center",
  },
  nameTxtStyle: {
    color: colors.black,
    fontSize: 16,
  },
  dateTxtStyle: {
    color: colors.black,
    fontSize: 12,
  },
});
