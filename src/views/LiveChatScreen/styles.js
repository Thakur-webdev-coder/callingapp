import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  flatListStyle: {
    flexDirection: "row",
    marginVertical: hp(2),
    paddingHorizontal: wp(5),
  },

  nameTextColoumn: {
    flexDirection: "column",
    alignSelf: "center",
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
    paddingLeft: wp(2),
    color: colors.black,
    fontSize: 14,
    fontWeight: "bold",
  },
  msgTxtStyle: {
    paddingLeft: wp(2),
    color: colors.black,
    fontSize: 10,
  },

  dateTxtStyle: {
    color: colors.black,
    fontSize: 10,
    marginStart: wp(20),
    alignSelf: "center",
  },
  headerSearchBar: {
    flexDirection: "row",
    marginHorizontal: wp(1),
    marginTop: wp(2.5),
  },

  horizontalLine: {
    borderWidth: 0.3,
    borderColor: colors.black,
  },
});
