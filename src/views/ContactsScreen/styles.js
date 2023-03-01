import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  flatListStyle: {
    flexDirection: "row",
    marginBottom: hp(2),
  },

  nameTextColoumn: {
    flexDirection: "column",
  },
  containerStyle: {
    marginTop: hp(2),
  },
  linearGradient: {
    backgroundColor: colors.primary,
    height: 48,
    width: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  imgstyle: {
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  nameTxtStyle: {
    paddingLeft: wp(4),
    color: colors.white,
    fontSize: 16,
  },
  headerSearchBar: {
    flexDirection: "row",
    marginHorizontal: wp(1),
    marginTop: wp(2.5),
  },
  inputTxtBoxStyle: {
    borderRadius: 10,
    marginLeft: wp(5),
    width: wp(75),
    height: hp(5.5),
    backgroundColor: colors.searchBar,
    color: colors.white,
    paddingHorizontal: wp(5),
  },
});
