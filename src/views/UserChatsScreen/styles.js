import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../../assets/colors";

export default StyleSheet.create({
  toolBar: {
    flexDirection: "row",

    backgroundColor: colors.secondary,
    alignItems: "center",
    //justifyContent: "space-between",
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(5)
  },
  nameContainer: {
    width: wp(60),
    paddingLeft: wp(5)
  },
  headerComponent: {
    flexDirection: 'row',
    // justifyContent: "space-around",
    backgroundColor: 'red',
    alignItems: "center",
    },

  textStyleToolbar: {
    color: colors.white,
    fontSize: 13,
  },

  searchTnputStyle: {
    borderRadius: 10,
    backgroundColor: colors.white,
    width: wp(80),
    // // height: hp(10),
    // marginTop: hp(3),
    // marginBottom:hp(1),
    // alignSelf: "center",
    borderWidth: 1,
    // borderColor: colors.black,
    flexDirection: "row",
    // justifyContent: "space-evenly",
  },

  sendMessageImg: {
    marginTop: hp(78),
    marginBottom: hp(1),
    flexDirection: "row",
    marginHorizontal: wp(3),
    justifyContent: "space-between",
    alignItems: 'center'
  },

  searchTnputStyleee: {
    width: wp(60),
    // height: hp(10),
    // fontSize: 20,
    color: colors.black,
  },
  arrowStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center'
  },

  dateBg: {
    backgroundColor: colors.white,
    padding: 10,
  },

});
