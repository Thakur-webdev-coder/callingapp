
import { Platform, StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  toolBar: {
    flexDirection: "row",
    ...Platform.select({
      // ios: {
      //   backgroundColor: 'red',
      // },
      android: {
        //marginTop:hp(2.5),
      },
    }),
    // marginTop:  (Platform.OS === 'ios') ? 80 : 100,
    backgroundColor: colors.redheader,
    // backgroundColor:/'#FF0000',
    alignItems: "center",
    // justifyContent: "space-between",
    padding: 15
  },


})