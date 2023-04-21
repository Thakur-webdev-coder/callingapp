import { StyleSheet } from "react-native";
import colors from "../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.secondary,
    flexDirection: "column",
  },
  secondWrapper: {
    flex: 1,

    backgroundColor: colors.white,
  },
  homeMainView:{ 
    flex: 1 ,
    backgroundColor: colors.white
    }
});
