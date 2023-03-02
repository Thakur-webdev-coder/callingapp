import { Image, SafeAreaView, TextInput, View } from "react-native";
import React from "react";
import styles from "./styles";
import { ic_app_logo } from "../../routes/imageRoutes";
import CustomText from "../../components/CustomText";
import colors from "../../../assets/colors";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CustomButton } from "../../components";
const DIDScreen = ({ navigation }) => {


    return (
        <SafeAreaView style={styles.mainView} >
            <View style={styles.wrapper}>
                <Image style={styles.logoStyle} source={ic_app_logo} />
                <CustomText
                    text={"Kokoafone DID"}
                    textColor={colors.black}
                    textSize={34}
                    fontWeight={'bold'}
                    marginTop={hp(8)}
                    marginLeft={wp(3)}
                    alignText={'center'}
                />

                <CustomButton
                    onPress={() => navigation.navigate("StackNavigator")}
                    primary
                    title={"Auto Assign DID"}
                    horzontalPadding={wp(12)}
                    marginTop={hp(7)}
                />
            </View>
        </SafeAreaView>
    );
};

export default DIDScreen;
