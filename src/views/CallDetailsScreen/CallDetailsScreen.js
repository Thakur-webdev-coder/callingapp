import { View, Text, Image, SafeAreaView } from "react-native";
import React from "react";
import styles from "./styles";
import AppStyle from "../../components/AppStyle";
import {
  ic_contact_avatar,
  ic_free_call,
  ic_free_msg,
  ic_free_video,
  ic_paid_call,
} from "../../routes/imageRoutes";
import CommonHeader from "../../components/Header/commonHeader";

const CallDetailsScreen = ({navigation,route}) => {
  const {Name,phoneNumber} =route.params
  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <CommonHeader headerText={"Contacts Details"} />

      <View style={styles.mainView}>
        <View style={styles.container_view}>
          <Image source={ic_contact_avatar} />
          <Text style={styles.textStyle}>{Name}</Text>
        </View>

        <View style={styles.container_view2}>
          <View>
            <Image source={ic_free_call} />
            <Text style={styles.iconTilteStle}>Call</Text>
          </View>

          <View>
            <Image source={ic_free_video} />
            <Text style={styles.iconTilteStle}>Video</Text>
          </View>

          <View>
            <Image source={ic_free_msg} />
            <Text style={styles.iconTilteStle}>Chat</Text>
          </View>

          <View>
            <Image source={ic_paid_call} />
            <Text style={styles.iconTilteStle}> Paid Call</Text>
          </View>
        </View>
      </View>
     

      <View style={styles.numBox}>
        <Text style={styles.mobileNumberText}>{phoneNumber}</Text>
        <Text style={styles.mobileNumberText}>Mobile</Text>
      </View>

     
    </SafeAreaView>
  );
};

export default CallDetailsScreen;
