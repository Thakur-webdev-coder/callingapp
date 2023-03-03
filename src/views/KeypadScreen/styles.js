import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  secondWrapper: {
    flex: 1.3,
    backgroundColor: colors.offWhite
  },
  wrapper3: {
    borderRadius: 20,
    overflow: 'hidden',
    flex: 2,
  },
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
    flex: 0.5,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: hp(5),
    paddingHorizontal: wp(6),

  },
  linearGradient: {
    height: 70,
    width: 70,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop:hp(1.5)
  },

  bottomImgStyle: {
    marginTop: hp(3),
  },
    inputTxtBoxStyle: {
    backgroundColor: colors.offWhite,
    borderRadius: 10,
   // marginLeft: wp(5),
    width: wp(73),
    color: colors.black,
    fontSize: 22,
    alignSelf: "center",
    marginTop: hp(3),
    marginBottom: hp(3),
    textAlign: 'center'
  },

  dialerStyle: {
    backgroundColor: colors.keypadColor,
    borderColor: colors.secondary,
    borderWidth: 0.3,
    justifyContent: "center",
    height: hp(12),
    width: wp(33.5),
    //marginTop: hp(3),
  },
  registerBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    alignSelf:'center',
    width:wp(60),
    //marginHorizontal: wp(18),
    marginTop: hp(3)
  },
  flatlistStyle: {
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 15,
    // overflow:'hidden'
    //marginTop:hp(10)
  }
});
