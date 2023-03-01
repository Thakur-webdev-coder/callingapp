import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
    flatListStyle: {
        flexDirection: 'row',
        marginBottom:hp(2)

    },
    containerStyle:
    {
        marginTop:hp(4),
    },
    linearGradient: {
        backgroundColor: colors.primary,
        height: 48,
        width: 48,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: "center",
    },
    userDetailView: {
        marginLeft: wp(4)
    },

    imgstyle: {
        alignSelf: 'center'
    },
    nameTxtStyle: {
        color: colors.white,
        fontSize: 16
    },
    dateTxtStyle: {
        color: colors.grayColor,
        fontSize: 12
    }

});
