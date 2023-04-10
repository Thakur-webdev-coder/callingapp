import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.backColor,
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
    borderColor: colors.secondary,
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

  listView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  listHorizontalLine: {
    borderWidth: 0.2,
    borderColor: colors.secondary,
  },
  emptyListStyle: {
    alignSelf: "center",
    color: colors.secondary,
    fontSize: 20,
    paddingTop: 20,
  },
});
