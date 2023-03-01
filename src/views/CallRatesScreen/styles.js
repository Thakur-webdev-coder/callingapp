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

  toolBar: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  horizontalLine: {
    borderWidth: 1,
    borderColor: colors.white,
  },
  listContainer: {
    marginTop: 20,
  },

  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  listHorizontalLine: {
    borderWidth: 0.2,
    borderColor: colors.white,
  },

  searchTnputStyle: {
    borderRadius: 10,
    backgroundColor: colors.searchBar,
    color: colors.white,
    paddingHorizontal: wp(5),
    width: wp(90),
    height:hp(5.5),
    marginTop: hp(3),
    alignSelf: "center",
  },
});
