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
        justifyContent: 'center', alignItems: 'center'
    },
    wrapper2: {
        backgroundColor: colors.secondary,
        flex: 2.5,
        borderTopLeftRadius: 50
    },
    imgContainer: {
        marginTop: hp(10),
        // height: 130,
        // width: 130,
        // borderRadius: 50,
        // alignSelf: 'center',
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
        marginHorizontal: wp(8),
        //width: wp(85),
        height: hp(7),
        backgroundColor: colors.searchBar,
        color: colors.black,
        paddingHorizontal: wp(5),
        fontSize: 20,
        marginTop:hp(5)
    },
});
