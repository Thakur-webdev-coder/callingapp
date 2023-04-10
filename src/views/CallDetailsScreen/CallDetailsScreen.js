import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
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
import { useSelector } from "react-redux";
import Sip from "@khateeb00/react-jssip";
import { Show_Toast } from "../../utils/toast";

const CallDetailsScreen = ({ navigation, route }) => {
  const { Name, phoneNumber } = route.params;
  const { balanceDetail = {} } = useSelector((store) => store.sliceReducer);
  console.log("route.params--->0", route.params);
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
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CallScreen", {
                  voiceCall: true,
                  callData: phoneNumber,
                })
              }
            >
              <Image source={ic_free_call} />
              <Text style={styles.iconTilteStle}>Call</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CallScreen", {
                  voiceCall: false,
                  callData: phoneNumber,
                })
              }
            >
              <Image source={ic_free_video} />
              <Text style={styles.iconTilteStle}>Video</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("UserChatsScreen", {
                  callData: phoneNumber,
                })
              }
            >
              <Image source={ic_free_msg} />
              <Text style={styles.iconTilteStle}>Chat</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                if (balanceDetail.credit > 0) {
                  Sip.makeCall(phoneNumber);
                  navigation.navigate("CallingScreen", {
                    callData: { name: Name },
                  });
                } else {
                  Show_Toast(
                    "Insufficient balance. Please recharge your account."
                  );
                }
              }}
            >
              <Image source={ic_paid_call} />
              <Text style={styles.iconTilteStle}> Paid Call</Text>
            </TouchableOpacity>
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
