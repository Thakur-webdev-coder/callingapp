import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";

export default StyleSheet.create({
  mainView: {
//padding: wp(5),
marginTop:hp(1),
paddingHorizontal:wp(5)
  },

  container_view: {
    flexDirection: "row",
  },
  container_view2: {
    marginTop: hp(6),
    flexDirection: "row",
    justifyContent: "space-between",
  },

  textStyle: {
    color: colors.black,
    fontSize: 14,
    alignSelf: "center",
    marginStart: wp(5),
    fontWeight:'600'
  },
  mobileNumberText: {
    color: colors.black,
    fontSize: 14,
    marginHorizontal: wp(5),
    fontWeight:'600'
  },

  iconTilteStle: {
    color: colors.secondary,
    fontSize: 12,
    alignSelf: "center",
    fontWeight:'600',
    paddingVertical:hp(1)
  },

  horizontalLine: {
    marginTop: hp(1),
    borderWidth: 0.3,
    borderColor: colors.black,
  },
  numBox: { 
    //margin: 10,
    borderBottomWidth:0.5,
    borderTopWidth:0.5,
    paddingVertical:hp(2) 
  }
  
});
