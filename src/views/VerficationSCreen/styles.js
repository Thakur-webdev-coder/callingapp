import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  phoneViewStyle: {
    backgroundColor: colors.inputColor,
    elevation: 20,
    paddingVertical: 20,
    marginHorizontal: wp(3),
    paddingHorizontal: 10,
    marginTop: 50,
    borderRadius: 10,
  },

  flagStyle: {
    backgroundColor: colors.inputColor,
    borderColor: colors.inputColor,
  },

  inputTextStyle: {
    color: colors.white,
    fontSize: 16,
  },
});
