import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export default StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    logoStyle: {
        marginTop: hp(10),
        alignSelf: 'center',
    },
    profileImg: {
        marginTop: hp(10),
        height: 130,
        width: 130,
        alignSelf: 'center',
        borderRadius: 80
    },
    inputTxtBoxStyle: {
        borderRadius: 15,
        marginHorizontal: wp(5),
        //width: wp(85),
        height: hp(7),
        backgroundColor: colors.searchBar,
        color: colors.black,
        paddingHorizontal: wp(5),
        fontSize: 20,
        marginTop: hp(4)
    },
});
