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
    justifyContent: "space-between",
    padding: 15,
  },

  textStyleToolbar: {
    color: colors.white,
  },

  searchTnputStyle: {
    borderRadius: 10,
    backgroundColor: colors.white,
    width: wp(70),
    height: hp(10),
    marginTop: hp(3),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.black,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  sendMessageImg: {
    marginTop: hp(65),
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  searchTnputStyleee: {
    width: wp(50),
    height: hp(10),
    fontSize: 20,
    color: colors.black,
  },

  dateBg: {
    backgroundColor: colors.white,
    padding: 10,
  },
});
