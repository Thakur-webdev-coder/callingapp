import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.black,
    flexDirection: "column",
  },

  tansparentView: {
    backgroundColor: colors.inviteCardBg,
    borderWidth: 2,
    marginVertical: 10,
    marginHorizontal: 10,
    flex: 1,
  },

  inviteText: {
    backgroundColor: colors.inviteTextBg,
    marginTop: hp(5),
    marginHorizontal: 20,
  },
});
