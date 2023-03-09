import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  flatListStyle: {
    flexDirection: "row",
    //marginTop: hp(2),
    paddingHorizontal: wp(5),
    alignItems:'center',
    // backgroundColor:'skyblue',
    borderBottomWidth:1,
    borderBottomColor:colors.darkGray,
    paddingVertical:hp(1)
  },

  nameTextColoumn: {
    flexDirection: "column",
  },
  containerStyle: {
    marginBottom: hp(7),
  },
  imgBox: {
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
    color: colors.black,
    fontSize: 16,
    fontWeight:"600",
    width:wp(67)
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
