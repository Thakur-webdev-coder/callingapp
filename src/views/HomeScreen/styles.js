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
    backgroundColor: colors.backColor,
    flex: 1.8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: wp(5)

  },
  settingLogoStyle: {
    alignSelf: "center",
    marginLeft: wp(33),
    marginTop: hp(1.5),
  },

  cardStyle: {
    backgroundColor: colors.secondary,
    marginTop: hp(1),
    borderRadius: 15,
    padding: 20,
    marginHorizontal:wp(5),
  },
  linearGradient: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    height: hp(13.7),
    width: wp(27.5),
    backgroundColor:colors.white,
    // height:'70%',
    // width:'70%',
    marginTop: hp(1),
    marginBottom: hp(1),
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
    
  },
  tabViewSyle: {
    alignItems: "center",
  },
  headerStyle:{
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15
  },
  balanceStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: hp(4),
  },
  imgView: {
    borderRadius:10,
    backgroundColor:'white',
    justifyContent:'center',
    padding:1
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
