import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  flatListStyle: {
    flexDirection: "row",
    marginVertical: hp(1.5),
    paddingLeft: wp(5),
  },

  nameTextColoumn: {
    flexDirection: "column",
    alignSelf: "center",
    width: wp(62),
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
    fontSize: 11,
  },

  dateTxtStyle: {
    color: colors.black,
    fontSize: 10,
    // marginLeft: wp(15),
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
  btnStyle: {
    height: 70,
    width: 70,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    margin: 20,
  },
});
