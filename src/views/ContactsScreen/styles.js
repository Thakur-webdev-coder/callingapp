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
    alignItems: "center",
    // backgroundColor:'skyblue',
    // borderBottomWidth:1,
    // borderBottomColor:colors.darkGray,
    paddingVertical: hp(1),
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
  kokaImgBox: {
    backgroundColor: "red",
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
    fontWeight: "600",
    width: wp(67),
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
  nameContainer: {
    width: wp(65),
    paddingLeft: wp(8),
  },
  toolBar: {
    flexDirection: "row",

    backgroundColor: colors.secondary,
    alignItems: "center",
    //justifyContent: "space-between",
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(5),
  },
  textStyleToolbar: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerComponent: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
  },
  indexLetterstyle: {
    color: colors.blueBottom,
    fontSize: hp("1.3%"),
  },
  indexLetterContainerstyle: {
    height: hp("3%"),
    width: 20,
  },
  indexconatinerstle: {
    right: hp("0.5%"),
    width: 15,
  },
  sectionHeaderContainer: {
    // backgroundColor: '#F5FCFF',
    padding: 10,
  },
  sectionHeaderLabel: {
    fontWeight: "bold",
    color: "black",
    fontSize: hp("2.6%"),
  },
  emptyListStyle: {
    alignSelf: "center",
    color: colors.secondary,
    fontSize: 20,
    paddingTop: 20,
  },
  inputTxtBoxStyle: {
    borderRadius: 10,
    marginLeft: wp(5),
    width: wp(70),
    height: hp(5.3),
    backgroundColor: colors.searchBar,
    color: colors.black,
    paddingHorizontal: wp(5),
  },
});
