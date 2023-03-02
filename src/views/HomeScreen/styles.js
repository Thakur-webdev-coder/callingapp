import { Platform, StyleSheet } from "react-native";
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
    ...Platform.select({
      // ios: {
      //   backgroundColor: 'red',
      // },
      android: {
        paddingTop: hp(1),
      },
    }),
  },
 
  wrapper2: {
    backgroundColor: colors.secondary,
    flex: 2,
    borderTopLeftRadius: 15,
    

},
  settingLogoStyle: {
    alignSelf: "center",
    marginLeft: wp(33),
    marginTop: hp(1.5),
  },

  cardStyle: {
    backgroundColor:colors.secondary,
    marginTop: hp(1),
    borderRadius: 10,
    padding: 20,
  },
  linearGradient: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: hp(13.7),
    width: wp(27.5),
    // height:'70%',
    // width:'70%',
    marginTop: hp(3),
  },
  tabViewSyle: {
    alignItems: "center",
  },
  froggyStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: hp(4),
  },
  voucherModalStyle: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: hp(2),
    // paddingHorizontal:wp(3)
  },
  textInputStyle: {
    marginTop: hp(2),
    borderBottomWidth: wp(0.6),
    borderBottomColor: colors.borderBottomColor,
    //fontSize:18
  },
  btnStyle: {
    flexDirection: "row",
    marginTop: hp(3),
    marginBottom: hp(1),
    justifyContent: "flex-end",
  },
  rechargeModalStyle: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: hp(2),
  },
  logOutModalBox: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: hp(2),
  },
});
