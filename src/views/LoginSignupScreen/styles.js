import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";

export default StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    wrapper2: {
        backgroundColor: colors.secondary,
        flex: 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    gradient: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
       },
});
